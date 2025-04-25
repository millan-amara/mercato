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

        const user = new User({
            email,
            phone: formatPhoneNumber(phone),
            business,
            coins: 50,
        });
        
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, err => {
                if(err) {
                    return next(new ExpressError('Login failed after registration', 500));
                }

                res.status(201).json({
                    _id: registeredUser._id,
                    email: registeredUser.email,
                    phone: registeredUser.phone,
                    business: registeredUser.business,
                    reviews: registeredUser.reviews,
                    rating: registeredUser.rating,
                    coins: registeredUser.coins,
                });

            });
        } catch (error) {

            if (error.message === 'A user with the given username is already registered') {
                return next(new ExpressError('User exists', 409));
            }
    
            // Generic error fallback
            return next(new ExpressError('Registration failed', 500));
        }   
}


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
    })
}

module.exports.getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.canReview)
}

module.exports.updateUser = async (req, res) => {

    try {
        if(req.user.id === req.params.userId) {
            const formatPhoneNumber = (phone) => {
                // Ensure it starts with 254 and remove leading zero if present
                if (phone.startsWith('0')) {
                    return '254' + phone.slice(1);
                }
                return phone; // Assume it's already in correct format
            };
            const user = await User.findByIdAndUpdate(req.user.id, {
                ...req.body,
                phone: formatPhoneNumber(req.body.phone)
            }, { new: true })
    
            await user.save()
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
            })
        } 
    } catch (error) {
        console.log(error)
    }

}

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
