const express = require('express')
const router = express.Router({ mergeParams: true })
const listings = require('../controllers/listings');
const { isLoggedIn, isBusiness, isListingAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .post([isLoggedIn, isBusiness, upload.array('files')], catchAsync(listings.createListing))

router.get('/fetchlistings', catchAsync(listings.fetchListings));
router.get('/fetchuserlistings', isLoggedIn, catchAsync(listings.fetchUserListings));

router.get('/:id', catchAsync(listings.showListing));
router.put('/:id', [isLoggedIn, isBusiness, isListingAuthor, upload.array('files')], catchAsync(listings.updateListing));
router.delete('/:id', isLoggedIn, isListingAuthor, catchAsync(listings.deleteListing));

module.exports = router;