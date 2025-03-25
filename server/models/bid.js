const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const BidSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: [true, 'Please add some text'],
    },
    price: Number,
    bookmarked: {
        type: Boolean,
        default: "false",
    },
    imgs: [ImageSchema],
    coins: {
        type: Number,
        required: true,
        default: 2
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Bid', BidSchema);