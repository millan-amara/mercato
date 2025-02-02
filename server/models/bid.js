const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

}, {
    timestamps: true,
});

module.exports = mongoose.model('Bid', BidSchema);