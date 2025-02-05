const User = require('../models/user');
const Post = require('../models/post');
const Bid = require('../models/bid');
const Review = require('../models/review');
const passport = require('passport');
const ExpressError = require('../utils/ExpressError');


module.exports.register = async (req, res) => {
    try {
        const {email,phone,business,password} = req.body;
        const user = new User({
            email: email,
            phone: phone,
            business: business,
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
                });

            });
        } catch (error) {

            if (e.message === 'A user with the given username is already registered') {
                return next(new ExpressError('User exists', 409));
            }
    
            // Generic error fallback
            return next(new ExpressError('Registration failed', 500));
        }   
}


module.exports.login = async (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(new ExpressError('Authentication failed', 500));
        }
        if (!user) {
            return next(new ExpressError('Invalid credentials', 401));
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(new ExpressError('Login failed', 500));
            }
            res.status(200).json({
                _id: user._id,
                email: user.email,
                fname: user.fname,
                phone: user.phone,
                business: user.business,
                website: user.website,
                reviews: user.reviews,
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
        
            const index = loggedInUser.canReview.indexOf(user.email);
            if (index !== -1) {
                loggedInUser.canReview.splice(index, 1);
            }
        
            await review.save();
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
        reviews: user.reviews,
        website: user.website
    })
}

module.exports.getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.canReview)
}

module.exports.updateUser = async (req, res) => {

    try {
        if(req.user.id === req.params.userId) {
            const user = await User.findByIdAndUpdate(req.user.id, {
                ...req.body
            }, { new: true })
    
            await user.save()
            res.status(201).json({
                _id: user._id,
                email: user.email,
                business: user.business,
                fname: user.fname,
                phone: user.phone,
                website: user.website
            })
        } 
    } catch (error) {
        console.log(error)
    }

}