const Payment = require('../models/payment');
const User = require('../models/user');
const Coin = require('../models/coin');
const IntaSend = require('intasend-node');
const { v4: uuidv4 } = require('uuid');
const ExpressError = require('../utils/ExpressError');

const intasend = new IntaSend(
  'ISPubKey_test_12d6d02b-fa7e-4f1e-b79f-b285af7c5331',
  'ISSecretKey_test_cd24e510-2f1a-49a3-ba95-dfc874f32565',
  true, // Test ? Set true for test environment
);

module.exports.createPayment = async (req, res) => {
    try {
        const uniqueId = `ORDER-${uuidv4()}`;
        let collection = intasend.collection();
    
        const response = await collection.mpesaStkPush({
            first_name: req.user.fname,
            last_name: 'Doe',
            email: req.user.email,
            host: 'https://peskaya-98bb2fd3d6e7.herokuapp.com',
            amount: req.body.amount,
            phone_number: '254700487751',
            api_ref: uniqueId,
        });
        const invoiceId = response.invoice.invoice_id;

        if (!response) {
            throw new ExpressError("Failed to initiate payment", 401)
        }

        const payment = new Payment({
            ...req.body,
            invoiceId: invoiceId,
            author: req.user._id,
            status: "PROCESSING",
        });
        const user = await User.findById(req.user._id);
        if(!user.canReview.includes(req.body.seller)) {
            user.canReview.push(req.body.seller);
        }

        await payment.save();
        await user.save();
    
        res.status(201).json(response);

    } catch (error) {
        console.error(`STK Push Resp error:`, error);
        res.status(500).json(error)
    }

}

module.exports.getPaymentStatus = async (req, res) => {
    try {
        let collection = intasend.collection();
        const response = await collection.status(req.params.invoiceId);

        const payment = await Payment.findOne({ invoiceId: req.params.invoiceId });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        if (response.invoice.state !== payment.status) {
            payment.status = response.invoice.state;
            await payment.save();
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching payment status', error });
    }
};

module.exports.fetchBusinessPayments = async (req, res) => { 
    const limit = 10;
    const user = await User.findById(req.user._id);

    if(req.body.page) {
        const pageNumber = req.body.page - 1;
        const payments = await Payment.find({ seller: user.email })
            .populate('author')
            .limit(limit)
            .skip(limit * pageNumber)
            .sort({ createdAt: -1 })

        const allPayments = await Payment.find({ seller: user.email }).populate('author');

        const count = allPayments.length;
        const pages = Math.ceil(count / limit);

        res.status(200).json({ payments, pages })

    }
}

module.exports.fetchUserTransactions = async (req, res) => {
    const limit = 10;
    const user = await User.findById(req.user._id);

    if(req.body.page) {
        const pageNumber = req.body.page - 1;
        const transactions = await Payment.find({ author: user._id })
            .limit(limit)
            .skip(limit * pageNumber)
            .sort({ createdAt: -1 })

        const allTransactions = await Payment.find({ author: user._id });

        const count = allTransactions.length;
        const pages = Math.ceil(count / limit);

        res.status(200).json({ transactions, pages })

    }
}

module.exports.disputeTransaction = async (req, res) => {
    console.log(req.params)
    console.log(req.body)

    try {
        const transaction = await Payment.findByIdAndUpdate(req.params.txId, {
            disputed: true,
            disputeReason: req.body.issue,
        }, { new: true })
    
        await transaction.save()
        res.status(201).json(transaction)
    } catch (error) {
        console.log(error)
    }
}

module.exports.rechargeCoins = async (req, res) => {
    try {
        console.log(req.body)
        const uniqueId = `ORDER-${uuidv4()}`;
        let collection = intasend.collection();
    
        const response = await collection.mpesaStkPush({
            first_name: req.user.fname,
            last_name: 'Doe',
            email: req.user.email,
            host: 'https://peskaya-98bb2fd3d6e7.herokuapp.com',
            amount: req.body.amount,
            phone_number: '254700487751',
            api_ref: uniqueId,
        });

        if (!response) {
            throw new ExpressError("Failed to initiate payment", 401)
        }

        const invoiceId = response.invoice.invoice_id;

        const coin = new Coin({
            ...req.body,
            invoiceId: invoiceId,
            author: req.user._id,
            status: "PROCESSING",
        });

        await coin.save();

        res.status(201).json(coin);

    } catch (error) {
        console.error(`STK Push Resp error:`, error);
        res.status(500).json(error)
    }
}

module.exports.getRechargeStatus = async (req, res) => {
    try {
        let collection = intasend.collection();
        const response = await collection.status(req.params.invoiceId);

        const payment = await Coin.findOne({ invoiceId: req.params.invoiceId });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        if (response.invoice.state !== payment.status) {
            payment.status = response.invoice.state;
            await payment.save();
        }

        const user = await User.findById(req.user._id);
        if(response.invoice.state === 'COMPLETE') {
            user.coins = user.coins + payment.amount;
            await user.save();
        }

        res.status(200).json({invoice: response.invoice, user});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching payment status', error });
    }
};

module.exports.fetchRechargeHistory = async (req, res) => {
    const limit = 10;
    const user = await User.findById(req.user._id);

    if(req.body.page) {
        const pageNumber = req.body.page - 1;
        const transactions = await Coin.find({ author: user._id })
            .limit(limit)
            .skip(limit * pageNumber)
            .sort({ createdAt: -1 })

        const allTransactions = await Coin.find({ author: user._id });

        const count = allTransactions.length;
        const pages = Math.ceil(count / limit);

        res.status(200).json({ transactions, pages })

    }
}