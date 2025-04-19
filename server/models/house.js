const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const HouseSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    bedrooms: String,
    price: Number,
    title: String,
    description: String,
    location: String,
    imgs: [ImageSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model('House', HouseSchema);