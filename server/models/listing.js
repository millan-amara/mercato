const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const ListingSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: String,
    actualPrice: Number,
    offerPrice: Number,
    title: String,
    imgs: [ImageSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Listing', ListingSchema);