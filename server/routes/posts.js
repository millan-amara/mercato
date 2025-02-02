const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isPostAuthor, isBusiness } = require('../middleware');

//Re-route into note router
const bidRouter = require('./bids')
router.use('/:postId/bids', bidRouter)

router.get('/fetchposts', isLoggedIn, catchAsync(posts.fetchPosts));
router.post('/createpost', isLoggedIn, catchAsync(posts.createPost));

router.post('/search', isLoggedIn, posts.fetchSearchPosts)
router.post('/search/page', isLoggedIn, posts.fetchPagePosts)

router.delete('/:id', isLoggedIn, isPostAuthor, catchAsync(posts.deletePost));
router.get('/:id', isLoggedIn, catchAsync(posts.showPost))


module.exports = router;