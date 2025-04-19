const Payment = require('../models/payment');
const User = require('../models/user');
const IntaSend = require('intasend-node');
const { v4: uuidv4 } = require('uuid');
const ExpressError = require('../utils/ExpressError');

const isTestMode = process.env.NODE_ENV !== 'production';

const intasend = new IntaSend(
  process.env.PUB_KEY,
  process.env.SEC_KEY,
  isTestMode, // Test ? Set true for test environment
);

module.exports.createPayment = async (req, res) => {
    try {
        console.log(req.body)
        const uniqueId = `ORDER-${uuidv4()}`;
        let collection = intasend.collection();

        if (!req.user.phone) {
            return res.status(400).json({ error: "Phone number is required" });
        }
    
        const response = await collection.mpesaStkPush({
            first_name: req.user.fname,
            last_name: 'Doe',
            email: req.user.email,
            host: 'https://peskaya-98bb2fd3d6e7.herokuapp.com',
            amount: req.body.amount,
            phone_number: req.user.phone,
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

        await payment.save();
        
    
        res.status(201).json(response);

    } catch (error) {
        console.error(`STK Push Resp error:`, error.response ? error.response.data : error);
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

        if (response.invoice.state === COMPLETE) {
            const user = await User.findById(req.user._id);
            if(!user.canReview.includes(req.body.seller)) {
                user.canReview.push(req.body.seller);
            }
            await user.save();
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

module.exports.fetchBusinessTotals = async (req, res) => { 
    const user = await User.findById(req.user._id);

    const allPayments = await Payment.find({ seller: user.email });

    // Calculate total amount
    // const totalAmount = allPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Calculate total for paid-out payments
    const totalPaidOut = allPayments
        .filter(payment => payment.paidOut)
        .reduce((sum, payment) => sum + payment.amount, 0);

    // Calculate total for approved payments
    const totalApprovedAmount = allPayments
        .filter(payment => payment.approved)
        .reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate total for non-approved payments
    const totalPendingAmount = allPayments
        .filter(payment => !payment.approved)
        .reduce((sum, payment) => sum + payment.amount, 0);

    res.status(200).json({ totalPaidOut, totalApprovedAmount, totalPendingAmount });
};


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

module.exports.fetchAllTransactions = async (req, res) => {
    let { page = 1, limit = 9 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    console.log(req.query)
    if(page) {
        const transactions = await Payment.find({})
            .limit(limit)
            .skip(limit * (page - 1))
            .sort({ createdAt: -1 })

        const allTransactions = await Payment.find({});

        const count = allTransactions.length;
        const pages = Math.ceil(count / limit);

        res.status(200).json({ transactions, pages })

    }
}

module.exports.approveTransaction = async (req, res) => {

    try {
        const transaction = await Payment.findByIdAndUpdate(req.params.txId, {
            approved: true,
        }, { new: true })
    
        await transaction.save()
        res.status(201).json(transaction)
    } catch (error) {
        console.log(error)
    }
}
