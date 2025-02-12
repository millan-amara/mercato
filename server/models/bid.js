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
    bookmarked: {
        type: Boolean,
        default: "false",
    },
    imgs: [ImageSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Bid', BidSchema);