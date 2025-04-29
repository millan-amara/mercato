const User = require('../models/user');
const Post = require('../models/post');
const Bid = require('../models/bid');
const Review = require('../models/review');
const passport = require('passport');
const ExpressError = require('../utils/ExpressError');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const apiKey = process.env.MAILGUN_API_KEY;
const DOMAIN = 'freelients.com';
const mg = mailgun.client({username: 'api', key: apiKey, url: 'https://api.eu.mailgun.net' });

const sendSMS = require('../utils/africasTalking');

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Random 4-digit code
};

const africastalking = require('africastalking')({
    apiKey: process.env.AT_API_KEY, 
    username: process.env.AT_USERNAME,
});
  
const sms = africastalking.SMS;


module.exports.register = async (req, res, next) => {
    try {
        const {email,phone,business,password} = req.body;

        const formatPhoneNumber = (phone) => {
            // Ensure it starts with 254 and remove leading zero if present
            if (phone.startsWith('0')) {
                return '254' + phone.slice(1);
            }
            return phone; // Assume it's already in correct format
        };

        const formattedPhone = formatPhoneNumber(phone);

        const existingUser = await User.findOne({ phone: formattedPhone });

        if (existingUser) {
            return next(new ExpressError("Phone number already in use", 400));
        }

        const otp = generateOTP();

        const user = new User({
            email,
            phone: formattedPhone,
            business,
            coins: 0,
            isVerified: false,
            verificationCode: otp, // Save OTP temporarily in DB
            verificationCodeExpires: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
        });
        
        const registeredUser = await User.register(user, password);

         // Send SMS with OTP
        await sendSMS(formattedPhone, `Your PESKAYA verification code is: ${otp}`);

        req.login(registeredUser, err => {
            if(err) {
                return next(new ExpressError('Login failed after registration', 500));
            }

            res.status(201).json({
                _id: registeredUser._id,
                message: "User registered. Please verify your phone number.",
                email: registeredUser.email,
                phone: registeredUser.phone,
                business: registeredUser.business,
                reviews: registeredUser.reviews,
                rating: registeredUser.rating,
                coins: registeredUser.coins,
                isVerified: registeredUser.isVerified,
            });

        });
    } catch (error) {
        if (error.message.includes('A user with the given username is already registered')) {
            return next(new ExpressError('User exists', 409));
          }
          return next(new ExpressError('Registration failed', 500));
        }  
}

// In routes/auth.js
module.exports.verifyOtp = async (req, res, next) => {
    const { phone, code } = req.body;

    if (!phone) {
        return res.status(400).json({ message: 'Phone number is required' });
    }
  
    const user = await User.findOne({ phone });
  
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  
    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }
  
    if (user.verificationCode !== code || user.verificationCodeExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
  
    user.isVerified = true;
    user.coins=100;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
  
    res.status(200).json({ message: 'Phone number verified successfully' });
};
  

module.exports.resendOtp = async (req, res, next) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ message: 'Phone number is required' });
    }
  
    try {
      const user = await User.findOne({ phone });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const RESEND_OTP_COOLDOWN_MS = 60 * 1000;

      if (user.otpLastSentAt && Date.now() - user.otpLastSentAt.getTime() < RESEND_OTP_COOLDOWN_MS) {
        return res.status(429).json({ message: 'Please wait before requesting another OTP' });
      }
  
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already verified' });
      }
  
      // Generate a new OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000); // 6 digit random number
  
      // Set new OTP and expiration
      user.verificationCode = newOtp;
      user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
      await user.save();
  
      // Send the OTP
      await sms.send({
        to: [`+${phone}`],
        message: `Your verification code is ${newOtp}. It expires in 10 minutes.`,
        // from: process.env.AFRICASTALKING_SENDER_ID,
      });
  
      res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to resend OTP' });
    }
};


module.exports.login = async (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(new ExpressError('An error occurred during authentication.', 500));
        }
        if (!user) {
            return next(new ExpressError('Invalid email or password.', 401));
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(new ExpressError('Failed to log you in. Please try again.', 500));
            }
            res.status(200).json({
                _id: user._id,
                email: user.email,
                fname: user.fname,
                phone: user.phone,
                business: user.business,
                website: user.website,
                reviews: user.reviews.length,
                rating: user.rating,
                coins: user.coins,
                isVerified: user.isVerified,
            }); 
        });
    })(req, res, next);
}

module.exports.loggedIn = async (req, res) => {
    if (req.isAuthenticated()) {
        res.send({ loggedIn: true, user: req.user });
    } else {
        res.send({ loggedIn: false });
    }
};

module.exports.logout = async (req, res) => {
    req.logout((err) => {
        if(err) { return next(err)}
        res.clearCookie('session');
        res.send({ loggedIn: false })
    });
}

module.exports.getOwnUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if(!user) {
            throw new ExpressError('User not found', 401)
        }
    
        const posts = await Post.find({author: user})
    
        res.status(200).json(posts)  
    } catch (error) {
        console.log(error)
    }

}

module.exports.getOwnUserBids = async (req, res) => {
    const user = await User.findById(req.user.id)
 
    if(!user) {
        throw new ExpressError('User not found', 401)
    }

    const bids = await Bid.find({author: user})
    res.status(200).json(bids)
}

module.exports.createUserReview = async (req, res) => {
    try {
        
        const user = await User.findById(req.params.userId);
        const loggedInUser = await User.findById(req.user.id);
    
        if(loggedInUser.canReview.includes(user.email)) {
            const review = new Review(req.body);
            review.author = req.user._id;
            user.reviews.unshift(review);
            await review.save();
            
        // Update the user's rating incrementally
            user.ratingSum += review.value;
            user.ratingCount += 1;
            user.rating = user.ratingSum / user.ratingCount;

            const index = loggedInUser.canReview.indexOf(user.email);
            if (index !== -1) {
                loggedInUser.canReview.splice(index, 1);
            }
        
            await user.save();
            await loggedInUser.save();
        
            res.status(201).json(review);
        } else {
            throw new ExpressError('Not allowed to do that', 401);
        }

    } catch (error) {
        console.log(error)
    }

}

module.exports.getUserReviews = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('reviews');

    const reviews = user.reviews

    res.status(200).json(reviews)
}

module.exports.getProfileOwner = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);

    res.status(200).json({
        _id: user._id,
        email: user.email,
        fname: user.fname,
        phone: user.phone,
        reviews: user.reviews.length,
        website: user.website,
        rating: user.rating,
        business: user.business,
        coins: user.coins,
        isVerified: user.isVerified,
    })
}

module.exports.getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            email: user.email,
            business: user.business,
            fname: user.fname,
            phone: user.phone,
            website: user.website,
            rating: user.rating,
            reviews: user.reviews.length,
            coins: user.coins,
            isVerified: user.isVerified,
        }
    })
}

module.exports.updateUser = async (req, res) => {
    try {
        if (req.user.id === req.params.userId) {
            const { fname, phone, website } = req.body;

            // Fetch current user
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update allowed fields
            if (fname) user.fname = fname;
            if (website) user.website = website;

            // Only update phone if user is not verified
            if (!user.isVerified && phone) {
                const formatPhoneNumber = (phone) => {
                // Ensure it starts with 254 and remove leading zero if present
                if (phone.startsWith('0')) {
                    return '254' + phone.slice(1);
                }
                   return phone; // Assume it's already in correct format
                };
        
                const formattedPhone = formatPhoneNumber(phone);
                user.phone = formattedPhone;
            }

            await user.save();

            res.status(201).json({
                _id: user._id,
                email: user.email,
                business: user.business,
                fname: user.fname,
                phone: user.phone,
                website: user.website,
                rating: user.rating,
                reviews: user.reviews.length,
                coins: user.coins,
                isVerified: user.isVerified,
            });
        } else {
            res.status(403).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Helper function to generate a token
async function generateToken() {
    const token = uuidv4();
    return token;
}

// Helper function to find a user by email
async function findUserByEmail(email) {
    try {
        const user = await User.findOne({ email }).exec();
        return user;
    } catch (error) {
        throw new ExpressError('Error finding user', 500)
    }
}

// Helper function to send email
async function sendResetEmail(user, token) {
    const apiUrl = process.env.BASE_URL;
    const resetUrl = `${apiUrl}/reset-password/${token}`;
    const message = {
        from: 'noreply@freelients.com',
        to: user.email,
        template: "forgot",
        'h:X-Mailgun-Variables': JSON.stringify({user: user.email, resetUrl: resetUrl}),
    };
    try {
        const msg = await mg.messages.create(DOMAIN, message)
        console.log(msg)
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


module.exports.forgot = async (req, res, next) => { 
    const email = req.body.email;
    
    try {
        const token = await generateToken();
        const user = await findUserByEmail(email);

        if(!user) {
            return res.status(200).json({ message: 'If your email exists, a reset link has been sent.' });
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000).toISOString();

        await user.save();
        await sendResetEmail(user, token);
        res.status(200).json({ message: 'If your email exists, a reset link has been sent.' });

    } catch (error) {
        console.error(error);
        next(error);
    }
}


module.exports.reset = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirm } = req.body;

        if (password !== confirm) {
            throw new ExpressError('Passwords do not match', 400)
        }

        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: new Date() } 
        }).exec();

        if (!user) {
            throw new ExpressError('Invalid or expired token', 400)
        }

        await user.setPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        await new Promise((resolve, reject) => req.logIn(user, err => (err ? reject(err) : resolve())));

        const message = {
            to: user.email,
            from: 'noreply@freelients.com',
            template: "reset",
	        'h:X-Mailgun-Variables': JSON.stringify({ user: user.email }),
        };

        await mg.messages.create(DOMAIN, message)
            .then(msg => console.log(msg))
            .catch(err => console.log(err));

        res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        next(error);
    }
}

module.exports.updateMpesa = async (req, res) => {
    const id = req.user._id;

    if (foundUser.mpesa && Object.keys(foundUser.mpesa).length > 0) {
        throw new ExpressError("You can't do that", 401)
    }
    const user = await User.findByIdAndUpdate(id, 
        { mpesa: req.body },
        { new: true, runValidators: true }
    )

    if (!user) {
        throw new ExpressError("User not found", 404);
    }
    
    await user.save();
    res.json(user);
}

module.exports.updateBank = async (req, res) => {
    const id = req.user._id;  
    
    const foundUser = await User.findById(id);

    if (foundUser.bank && Object.keys(foundUser.bank).length > 0) {
        throw new ExpressError("You can't do that", 401)
    }

    const user = await User.findByIdAndUpdate(id, 
        { bank: req.body },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new ExpressError("User not found", 404);
    }
    
    await user.save();
    res.json(user)
}


module.exports.fetchUsers = async (req, res) => {
    const users = await User.find({})

    console.log(users)
    res.json(users)

};


module.exports.updateVerified = async (req, res) => {

    try {
 
        const user = await User.findByIdAndUpdate(req.params.userId, {
            isVerified: true,
        }, { new: true })
    
        res.status(201).json({
            _id: user._id,
            email: user.email,
            business: user.business,
            fname: user.fname,
            phone: user.phone,
            website: user.website,
            rating: user.rating,
            reviews: user.reviews.length,
            coins: user.coins,
            isVerified: user.isVerified
        })
    } catch (error) {
        console.log(error)
    }

}
