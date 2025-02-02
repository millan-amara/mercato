const Payment = require('../models/payment');
const User = require('../models/user');


module.exports.createPayment = async (req, res) => {
    
    const payment = new Payment({
        ...req.body,
    });
    payment.author = req.user._id;

    const user = await User.findById(req.user._id);
    if(!user.canReview.includes(req.body.seller)) {
        user.canReview.push(req.body.seller);
    }

    await payment.save();
    await user.save();

    res.status(201).json(payment);
}

module.exports.fetchBusinessPayments = async (req, res) => { 
    const limit = 3;
    const user = await User.findById(req.user._id);

    if(req.body.page) {
        const pageNumber = req.body.page - 1;
        const payments = await Payment.find({ seller: user.email })
            .populate('author')
            .limit(limit)
            .skip(limit * pageNumber)

        const allPayments = await Payment.find({ seller: user.email }).populate('author');

        const count = allPayments.length;
        const pages = Math.ceil(count / limit);

        res.status(200).json({ payments, pages })

    }
}