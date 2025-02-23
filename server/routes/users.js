const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router.post('/users/forgot', users.forgot);
router.post('/users/reset/:token', users.reset);

router.route('/register')
    .post(catchAsync(users.register));

router.post('/login', catchAsync(users.login));

router.get('/logged-in', catchAsync(users.loggedIn));
router.get('/logout', isLoggedIn, catchAsync(users.logout));

router.get('/users/getownposts', isLoggedIn, catchAsync(users.getOwnUserPosts));
router.get('/users/getownbids', isLoggedIn, catchAsync(users.getOwnUserBids));

router.get('/users/currentuser', isLoggedIn, catchAsync(users.getCurrentUser));

router.route('/users/:userId/reviews')
    .post(isLoggedIn, catchAsync(users.createUserReview))
    .get(isLoggedIn, catchAsync(users.getUserReviews))

router.put('/users/:userId/updateuser', isLoggedIn, users.updateUser);
router.get('/users/:userId', isLoggedIn, catchAsync(users.getProfileOwner));





module.exports = router;