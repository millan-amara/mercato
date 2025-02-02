const Post = require('../models/post');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');


module.exports.fetchPosts = async (req, res) => {
    const limit = 10;
    const posts = await Post.find({}).limit(limit);

    res.json(posts)
}

module.exports.fetchSearchPosts = async (req, res) => {
    const searchQuery = req.body.search;
    const limit = 1;
    let page = req.body.page ? parseInt(req.body.page) : 0;

    if (searchQuery) {
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
                { $skip: limit * page },
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
            console.log(count)
            console.log(pages)

            res.json({ posts: foundPosts, pages })
    }
}

module.exports.fetchPagePosts = async (req, res) => {
    const searchQuery = req.body.search;
    const limit = 1;
    const pageNumber = req.body.page - 1;
    console.log(req.body)
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