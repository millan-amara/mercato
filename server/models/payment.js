const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    seller: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    item: {
        type: String,
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
    received: {
        type: Boolean,
        default: false,
    },
    approved: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);