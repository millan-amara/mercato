const Post = require('../models/post');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const moment = require("moment");


module.exports.fetchPosts = async (req, res) => {
    
    let { searchQuery, page = 1, limit = 9 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (searchQuery) {
        console.log(searchQuery)
            const foundPosts = await Post.aggregate([
                {
                    $search: {
                        index: 'default',
                        text: {
                            path: {
                                'wildcard' : '*'
                            },
                            query: searchQuery,
                            fuzzy: {
                                maxEdits: 2,
                                prefixLength: 2
                            }
                        }
                    }
                },
                { $skip: (limit * (page - 1)) },
                { $limit: limit }
            ]);

            const allPosts = await Post.aggregate([
                {
                    $search: {
                        index: 'default',
                        text: {
                            path: {
                                'wildcard' : '*'
                            },
                            query: searchQuery,
                            fuzzy: {
                                maxEdits: 2,
                                prefixLength: 2
                            }
                        }
                    }
                },
            ]);
            const count = allPosts.length;
            const pages = Math.ceil(count / limit);

            res.json({ posts: foundPosts, pages })
    } else {
        const posts = await Post.find({}).limit(limit).skip((page - 1) * limit);
        const allPosts = await Post.find({});
        const count = allPosts.length;
        const pages = Math.ceil(count / limit);

        res.json({ posts, pages })
    }
}

// module.exports.fetchPagePosts = async (req, res) => {
//     const searchQuery = req.body.search;
//     const limit = 9;
//     const pageNumber = req.body.page - 1;

//     if(req.body.search) {
//         const posts = await Post.aggregate([
//             {
//                 $search: {
//                     index: 'default',
//                     text: {
//                         path: {
//                             'wildcard' : '*'
//                         },
//                         query: searchQuery,
//                         fuzzy: {
//                             maxEdits: 2,
//                             prefixLength: 2
//                         }
//                     }
//                 }
//             },
//             { $skip: limit * pageNumber },
//             { $limit: limit }
//         ]);

//         res.status(200).json(posts)
//     }
// }

module.exports.createPost = async (req, res) => {
    try {
        const userId = req.user._id;
        // const todayStart = moment().startOf('day').toDate();
        // const todayEnd = moment().endOf('day').toDate();

        // Count the user's posts created today
        // const postCount = await Post.countDocuments({
        //     author: userId,
        //     createdAt: { $gte: todayStart, $lte: todayEnd }
        // });

        // if (postCount >= 1) {
        //     return res.status(403).json({ error: "Daily post limit reached. Try again tomorrow." });
        // }

        // Create new post
        const post = new Post({
            ...req.body,
            status: 'pending',
            author: userId,
        });

        await post.save();
        res.status(201).json({ post });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
}

module.exports.showPost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.json(post)
}

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) throw new ExpressError('Post not found', 404);
    await Post.findOneAndDelete({ _id: id });
    res.status(200).json({ message: 'Post deleted successfully' });
}