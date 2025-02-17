const Payment = require('../models/payment');
const User = require('../models/user');

const IntaSend = require('intasend-node');

let intasend = new IntaSend(
  'ISPubKey_test_12d6d02b-fa7e-4f1e-b79f-b285af7c5331',
  'ISSecretKey_test_bad69278-9a8f-4741-b3f7-a8e3fcf8d15d',
  true, // Test ? Set true for test environment
);



module.exports.createPayment = async (req, res) => {
    
    // const payment = new Payment({
    //     ...req.body,
    // });
    // payment.author = req.user._id;

    // const user = await User.findById(req.user._id);
    // if(!user.canReview.includes(req.body.seller)) {
    //     user.canReview.push(req.body.seller);
    // }

    // await payment.save();
    // await user.save();

    // res.status(201).json(payment);
    let collection = intasend.collection();
    collection
    .mpesaStkPush({
            first_name: 'Joe',
            last_name: 'Doe',
            email: 'joe@doe.com',
            host: 'https://peskaya-98bb2fd3d6e7.herokuapp.com/',
            amount: 10,
            phone_number: '254700487751',
            api_ref: 'test',
    })
    .then((resp) => {
        // Redirect user to URL to complete payment
        console.log(`STK Push Resp:`,resp);
        res.status(201).json(resp);
        })
    .catch((err) => {
        console.error(`STK Push Resp error:`,err);
    });
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