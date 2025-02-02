const express = require('express')
const router = express.Router({ mergeParams: true })
const bids = require('../controllers/bids');
const { isLoggedIn, isBusiness } = require('../middleware');
const catchAsync = require('../utils/catchAsync')

router.route('/')
    .get(isLoggedIn, catchAsync(bids.getBids))
    .post(isLoggedIn, isBusiness, catchAsync(bids.addBid))

router.put('/:bidId', isLoggedIn, catchAsync(bids.updateBid));


module.exports = router;