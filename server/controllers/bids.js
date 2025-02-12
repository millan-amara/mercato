const Post = require('../models/post');
const User = require('../models/user');
const Bid = require('../models/bid');
const ExpressError = require('../utils/ExpressError');


module.exports.getBids = async (req, res) => {
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
    console.log('got em bids,')


    res.status(200).json(bids)
}

module.exports.addBid = async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findById(req.user.id)

        if(!user) {
            throw new ExpressError('Not allwoed to do that', 401)
        }
    
        const post = await Post.findById(req.params.postId)
    
        const bid = new Bid({
            ...req.body,
        });
        bid.imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        bid.author = req.user._id;
        post.bids.unshift(bid)
        console.log(bid)
    
        await bid.save();
        await post.save();
    
        res.status(200).json(bid);
    } catch (error) {
        console.log(error)
    }
}

module.exports.updateBid = async (req, res) => {
    console.log(req.params)

    const bid = await Bid.findByIdAndUpdate(req.params.bidId, {
        bookmarked: true
    });
    await bid.save();
    res.status(200).json(bid);
}