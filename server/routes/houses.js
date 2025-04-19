const express = require('express')
const router = express.Router({ mergeParams: true })
const houses = require('../controllers/houses');
const { isLoggedIn, isBusiness, isHouseAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .post([isLoggedIn, isBusiness, upload.array('files')], catchAsync(houses.createHouse))

router.get('/fetchhouses', catchAsync(houses.fetchHouses));
router.get('/fetchuserhouses', isLoggedIn, catchAsync(houses.fetchUserHouses));

router.get('/:id', catchAsync(houses.showHouse));
router.put('/:id', [isLoggedIn, isBusiness, isHouseAuthor, upload.array('files')], catchAsync(houses.updateHouse));
router.delete('/:id', isLoggedIn, isHouseAuthor, catchAsync(houses.deleteHouse));

module.exports = router;