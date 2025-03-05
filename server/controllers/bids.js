const Post = require('../models/post');
const User = require('../models/user');
const Bid = require('../models/bid');
const ExpressError = require('../utils/ExpressError');


module.exports.getBids = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
 
        if(!user) {
            throw new ExpressError('User not found', 401)
        }
    
        const post = await Post.findById(req.params.postId)
            .populate({
                path: 'bids',
                populate: { path: 'author' }
            })
    
        if(!post || post.author.toString() !== req.user.id) {
            throw new ExpressError('Not authorized', 401)
        }
        
        // Sorting: First by coins (descending), then by createdAt (newest first)
        const bids = post.bids.sort((a, b) => {
            if (a.coins === b.coins) {
                return new Date(a.createdAt) - new Date(b.createdAt); // Sort by createdAt (latest first)
            }
            return b.coins - a.coins; // Sort by coins (descending)
        });
    
        res.status(200).json(bids)
    } catch (error) {
        console.log(error)
    }
}

module.exports.addBid = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)

        if(!user) {
            throw new ExpressError('Not allowed to do that', 401)
        }

        if(user.coins < req.body.coins) {
            throw new ExpressError('Please recharge your coins', 401);
        }

        if(req.body.coins < 2) {
            throw new ExpressError('Minimum of 2 coins', 401);
        }

        const post = await Post.findById(req.params.postId);

        if(!post) {
            throw new ExpressError('Post not found', 404)
        }

        if(post.bids.length >= 30) {
            throw new ExpressError('Bid limit reached', 404)
        }

        if(post.cantBid.includes(req.user._id)) {
            throw new ExpressError("Sorry, you can't do that", 401);
        }

        const bid = new Bid({
            ...req.body,
            author: req.user._id
        });
        if(req.files) {
            bid.imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        }

        post.bids.unshift(bid);
        post.cantBid.push(req.user._id);
    
        await bid.save();
        await post.save();
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            coins: user.coins - req.body.coins,  
        }, { new: true })

        res.status(200).json({
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
                business: updatedUser.business,
                fname: updatedUser.fname,
                phone: updatedUser.phone,
                website: updatedUser.website,
                rating: updatedUser.rating,
                reviews: updatedUser.reviews.length,
                coins: updatedUser.coins,
            },
            bid
        });
    

    } catch (error) {
        console.error(error);
    }
}

module.exports.updateBid = async (req, res) => {
    const bid = await Bid.findByIdAndUpdate(req.params.bidId, {
        bookmarked: true
    });
    await bid.save();
    res.status(200).json(bid);
}