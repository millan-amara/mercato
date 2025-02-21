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
        const bids = post.bids
    
        res.status(200).json(bids)
    } catch (error) {
        console.log(error)
    }

}

module.exports.addBid = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)

        if(!user) {
            throw new ExpressError('Not allwoed to do that', 401)
        }

        if(user.coins >= req.body.coins) {
            const post = await Post.findById(req.params.postId)
    
            const bid = new Bid({
                ...req.body,
            });
            if(req.files) {
                bid.imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
            }
            bid.author = req.user._id;
            post.bids.unshift(bid)
        
            await bid.save();
            await post.save();
            const updatedUser = await User.findByIdAndUpdate(req.user._id, {
                coins: user.coins - req.body.coins,  
            }, { new: true })

            await updatedUser.save()

            res.status(200).json({
                _id: updatedUser._id,
                email: updatedUser.email,
                business: updatedUser.business,
                fname: updatedUser.fname,
                phone: updatedUser.phone,
                website: updatedUser.website,
                rating: updatedUser.rating,
                reviews: updatedUser.reviews.length,
                coins: updatedUser.coins,
            });
        } else {
            throw new ExpressError('Please recharge your coins', 401);
        }
    

    } catch (error) {
        console.log(error)
    }
}

module.exports.updateBid = async (req, res) => {
    const bid = await Bid.findByIdAndUpdate(req.params.bidId, {
        bookmarked: true
    });
    await bid.save();
    res.status(200).json(bid);
}