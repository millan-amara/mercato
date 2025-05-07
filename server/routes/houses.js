const express = require('express')
const router = express.Router({ mergeParams: true })
const houses = require('../controllers/houses');
const { isLoggedIn, uploadMiddleware, isHouseAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');

router.route('/')
    .post([isLoggedIn, uploadMiddleware], catchAsync(houses.createHouse))

router.get('/fetchhouses', catchAsync(houses.fetchHouses));
router.get('/fetchuserhouses', isLoggedIn, catchAsync(houses.fetchUserHouses));

router.put('/updateaccess/:id', isLoggedIn, catchAsync(houses.updateHouseAccess));

router.get('/:id', catchAsync(houses.showHouse));
router.put('/:id', [isLoggedIn, multer().fields([]), uploadMiddleware, isHouseAuthor], catchAsync(houses.updateHouse));
router.delete('/:id', isLoggedIn, isHouseAuthor, catchAsync(houses.deleteHouse));

module.exports = router;