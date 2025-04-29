const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router.get('/users', users.fetchUsers);
router.post('/users/forgot', users.forgot);
router.post('/users/reset/:token', users.reset);

router.route('/register')
    .post(catchAsync(users.register));

router.post('/login', catchAsync(users.login));
router.post('/verify-otp', catchAsync(users.verifyOtp));
router.post('/resend-otp', catchAsync(users.resendOtp));

router.get('/logged-in', catchAsync(users.loggedIn));
router.get('/logout', isLoggedIn, catchAsync(users.logout));

router.get('/users/getownposts', isLoggedIn, catchAsync(users.getOwnUserPosts));
router.get('/users/getownbids', isLoggedIn, catchAsync(users.getOwnUserBids));

router.get('/users/currentuser', isLoggedIn, catchAsync(users.getCurrentUser));

router.route('/users/:userId/reviews')
    .post(isLoggedIn, catchAsync(users.createUserReview))
    .get(isLoggedIn, catchAsync(users.getUserReviews))

router.put('/users/:id/update-mpesa', isLoggedIn, users.updateMpesa);
router.put('/users/:id/update-bank', isLoggedIn, users.updateBank);

router.put('/users/:userId/updateuser', isLoggedIn, users.updateUser);
router.put('/users/:userId/updateverified', isLoggedIn, users.updateVerified);
router.get('/users/:userId', isLoggedIn, catchAsync(users.getProfileOwner));





module.exports = router;