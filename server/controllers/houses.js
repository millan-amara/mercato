const User = require('../models/user');
const House = require('../models/house');
const { cloudinary } = require("../cloudinary");
const ExpressError = require('../utils/ExpressError');

module.exports.createHouse = async (req, res) => {
    try {
        const { caretaker, latitude, longitude } = req.body;
        const user = await User.findById(req.user.id)

        const formatPhoneNumber = (phone) => {
            // Ensure it starts with 254 and remove leading zero if present
            if (phone.startsWith('0')) {
                return '254' + phone.slice(1);
            }
            return phone; // Assume it's already in correct format
        };

        if(!user) {
            throw new ExpressError('Not allowed to do that', 401)
        }

        const house = new House({
            ...req.body,
            caretaker: formatPhoneNumber(caretaker),
            coordinates: {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
            },
            author: req.user._id
        });
        if(req.files) {
            house.imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        }
    
        await house.save();

        res.status(200).json(house);
    

    } catch (error) {
        console.error(error);
    }
}

module.exports.fetchHouses = async (req, res) => {
    
    let { searchQuery, page = 1, limit = 9 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (searchQuery) {
            const foundHouses = await House.aggregate([
                {
                    $search: {
                        index: 'adsquery',
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

            const allHouses = await House.aggregate([
                {
                    $search: {
                        index: 'adsquery',
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
            const count = allHouses.length;
            const pages = Math.ceil(count / limit);

            res.json({ houses: foundHouses, pages })
    } else {
        const houses = await House.find({}).limit(limit).skip((page - 1) * limit);
        const allHouses = await House.find({});
        const count = allHouses.length;
        const pages = Math.ceil(count / limit);

        res.json({ houses, pages })
    }
}

module.exports.showHouse = async (req, res) => {
    const house = await House.findById(req.params.id);
    res.json(house)
}

module.exports.deleteHouse = async (req, res) => {
    const { id } = req.params;
    const house = await House.findById(id);
    if (!house) throw new ExpressError('House not found', 404);
    await House.findOneAndDelete({ _id: id });
    res.status(200).json({ message: 'House deleted successfully' });
}

module.exports.updateHouse = async (req, res) => {
    try {
        const house = await House.findByIdAndUpdate(req.params.id, req.body);
        if (!house) {
            return res.status(404).json({ error: "House not found" });
        }

        const { caretaker, latitude, longitude } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            throw new ExpressError('Not allowed to do that', 401);
        }

        // Format phone number if caretaker info is provided
        const formatPhoneNumber = (phone) => {
            if (phone.startsWith('0')) {
                return '254' + phone.slice(1);
            }
            return phone;
        };

        house.caretaker = caretaker ? formatPhoneNumber(caretaker) : house.caretaker;

        // Update coordinates if latitude and longitude are provided
        if (latitude && longitude) {
            house.coordinates = {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
            };
        }

        if (req.files) {
            const houseImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
            house.imgs = house.imgs.concat(houseImages);
        }
    
        if (req.body.deleted) {
            const deleteImages = req.body.deleted;
            
            const images = [...deleteImages]
           
            for (let filename of images) {
                await cloudinary.uploader.destroy(filename);
            }
            await house.updateOne({ $pull: { imgs: { filename: { $in: deleteImages } } } });
        }

        await house.save();

        res.status(201).json(house)
    
    } catch (e) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

module.exports.fetchUserHouses = async (req, res) => {
    try {
        const { page = 1, limit = 9 } = req.query;
        const userId = req.user._id;
        if (!userId) return res.status(400).json({ error: "User ID is required" });
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
    
        const houses = await House.find({ author: userId })
          .sort({ createdAt: -1 })
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber);
    
        const totalHouses = await House.countDocuments({ author: userId });
        const hasMore = pageNumber * limitNumber < totalHouses;
        const pages = Math.ceil(totalHouses / limitNumber);
    
        res.json({ houses, hasMore, pages });
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" });
      }
}