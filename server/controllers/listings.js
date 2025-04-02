const User = require('../models/user');
const Listing = require('../models/listing');
const { cloudinary } = require("../cloudinary");
const ExpressError = require('../utils/ExpressError');

module.exports.createListing = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if(!user) {
            throw new ExpressError('Not allowed to do that', 401)
        }

        const listing = new Listing({
            ...req.body,
            author: req.user._id
        });
        if(req.files) {
            listing.imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        }
    
        await listing.save();

        res.status(200).json(listing);
    

    } catch (error) {
        console.error(error);
    }
}

module.exports.fetchListings = async (req, res) => {
    
    let { searchQuery, page = 1, limit = 9 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (searchQuery) {
            const foundListings = await Listing.aggregate([
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

            const allListings = await Listing.aggregate([
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
            const count = allListings.length;
            const pages = Math.ceil(count / limit);

            res.json({ listings: foundListings, pages })
    } else {
        const listings = await Listing.find({}).limit(limit).skip((page - 1) * limit);
        const allListings = await Listing.find({});
        const count = allListings.length;
        const pages = Math.ceil(count / limit);

        res.json({ listings, pages })
    }
}

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.json(listing)
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError('Listing not found', 404);
    await Listing.findOneAndDelete({ _id: id });
    res.status(200).json({ message: 'Listing deleted successfully' });
}

module.exports.updateListing = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, req.body);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        const listingImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
        listing.imgs = listing.imgs.concat(listingImages);
    
        if (req.body.deleted) {
            const deleteImages = req.body.deleted;
            
            const images = [...deleteImages]
           
            for (let filename of images) {
                await cloudinary.uploader.destroy(filename);
            }
            await listing.updateOne({ $pull: { imgs: { filename: { $in: deleteImages } } } });
        }

        await listing.save();

        res.status(201).json(listing)
    
    } catch (e) {
        console.log(e)
    }

}