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
    userPermissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    bedrooms: String,
    price: Number,
    title: String,
    description: String,
    url: String,
    location: String,
    caretaker: String,
    imgs: [ImageSchema],
    coordinates: {
        lat: Number,
        lng: Number
    }
      
}, {
    timestamps: true,
});

module.exports = mongoose.model('House', HouseSchema);