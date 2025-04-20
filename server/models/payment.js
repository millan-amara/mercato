const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    cartItems: [],
    address: String,
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

module.exports = mongoose.model('Payment', PaymentSchema);