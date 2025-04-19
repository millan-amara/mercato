const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bid = require('./bid');

const PostSchema = new Schema({
    description: String,
    status: String,
    cantBid: [],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bids: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Bid'
        }
    ]
}, {
    timestamps: true,
});

PostSchema.post('findOneAndDelete', async function (doc) {
    if (doc && doc.bids && doc.bids.length) {
        try {
            await Bid.deleteMany({ _id: { $in: doc.bids } });
        } catch (error) {
            console.error('Error deleting bids:', error);
        }
    }
})

module.exports = mongoose.model('Post', PostSchema);