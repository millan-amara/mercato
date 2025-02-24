const Post = require('../models/post');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');


// module.exports.fetchPosts = async (req, res) => {
//     console.log(req.query)
//         // let { search, page = 1, limit = 3 } = req.query;
//         // page = parseInt(page);
//         // limit = parseInt(limit);
    
//         // // const posts = await Post.find({}).limit(limit);
    
//         // // res.json(posts)
//         // let query = {}; 
    
//         // if (search) {
//         //     query = {
//         //         $text: { $search: search } // Use MongoDB text index
//         //     };
//         // }
    
//         // const totalPosts = await Post.countDocuments(query);
//         // const posts = await Post.find(query)
//         //     .skip((page - 1) * limit)
//         //     .limit(limit);
//         // console.log(posts)
//         // console.log(totalPosts)
//         // res.json({ 
//         //     posts, 
//         //     totalPages: Math.ceil(totalPosts / limit),
//         // });
// }

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

module.exports.fetchPagePosts = async (req, res) => {
    const searchQuery = req.body.search;
    const limit = 9;
    const pageNumber = req.body.page - 1;

    if(req.body.search) {
        const posts = await Post.aggregate([
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
            { $skip: limit * pageNumber },
            { $limit: limit }
        ]);

        res.status(200).json(posts)
    }
}

module.exports.createPost = async (req, res) => {

    const post = new Post({
        ...req.body,
    });
    post.author = req.user._id;

    await post.save();

    res.status(201).json(post);
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