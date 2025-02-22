const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoinSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    invoiceId: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Coin', CoinSchema);