const User = require('./models/user');
const Post = require('./models/post');
const ExpressError = require('./utils/ExpressError')

// module.exports.isLoggedIn = (req, res, next) => {
//     try {
//         console.log(req.params.id)
//         console.log(req.user._id)

//         if (!req.isAuthenticated()) {
//             req.session.returnTo = req.originalUrl;
//             return res.redirect('/login');
//         }
//         next()
//     } catch (error) {
//         console.log('gone wrong')
//     }


// }

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