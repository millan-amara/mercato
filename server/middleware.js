const User = require('./models/user');
const Post = require('./models/post');
const House = require('./models/house');
const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError');
const { imageUpload, videoUpload, dynamicStorage } = require('./cloudinary/index');
const multer = require('multer');

const upload = multer({ storage: dynamicStorage }).fields([
    { name: 'files', maxCount: 6 },
    { name: 'video', maxCount: 1 }
]);

module.exports.uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Upload error:", err);
            return res.status(400).json({ error: err.message });
        }
        console.log("Request files:", req.files);
        next();
    });
};
  



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({ message: 'Unauthorized' });
        }
        return res.redirect('/login');
    }
    next();
  };
  

module.exports.isPostAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        console.log('not allowed to do that')
        throw new ExpressError('Not allowed to do that', 403)
    }
    next();
}

module.exports.isListingAuthor = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.author.equals(req.user._id)) {
        console.log('not allowed to do that')
        throw new ExpressError('Not allowed to do that', 403)
    }
    next();
}

module.exports.isHouseAuthor = async (req, res, next) => {
    const { id } = req.params;
    const house = await House.findById(id);
    if (!house.author.equals(req.user._id)) {
        console.log('not allowed to do that')
        throw new ExpressError('Not allowed to do that', 403)
    }
    next();
}

module.exports.isBusiness = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.business) {
            console.log('not allowed to do that')
            const error = new ExpressError('Not allowed to do that', 403)
            return next(error)
        } 
        next(); 
    } catch (error) {
        next(error)
    }

}


  