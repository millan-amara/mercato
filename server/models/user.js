const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: 'false',
    },
    business: Boolean, 
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    rating: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    canReview: [],
    bank: {},
    mpesa: {},
    fname: String,
    coins: Number,
    phone: {
        type: String,
        required: true,
        unique: true
    },
    website: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationCode: String,
    verificationCodeExpires: Date,
    otpLastSentAt: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', UserSchema);