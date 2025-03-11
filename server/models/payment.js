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
    status: {
        type: String,
        required: true
    },
    invoiceId: {
        type: String,
        required: true,
        unique: true
    },
    disputed: {
        type: Boolean,
        default: 'false',
    },
    disputeReason: {
        type: String,
        required: true,
        default: "none"
    },
    approved: {
        type: Boolean,
        default: 'false',
    },
    paidOut: {
        type: Boolean,
        default: 'false',
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);