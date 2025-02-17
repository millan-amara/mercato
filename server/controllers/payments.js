const Payment = require('../models/payment');
const User = require('../models/user');
const IntaSend = require('intasend-node');
const { v4: uuidv4 } = require('uuid');

const intasend = new IntaSend(
  'ISPubKey_test_12d6d02b-fa7e-4f1e-b79f-b285af7c5331',
  'ISSecretKey_test_e605175f-5ae6-47b8-b19f-0a04f5df8d11',
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
    try {
        const uniqueId = `ORDER-${uuidv4()}`;
        let collection = intasend.collection();
    
        const response = await collection.mpesaStkPush({
            first_name: 'Joe',
            last_name: 'Doe',
            email: 'joe@doe.com',
            host: 'https://peskaya-98bb2fd3d6e7.herokuapp.com/',
            amount: 1,
            phone_number: '254700487751',
            api_ref: uniqueId,
        });
    
        console.log(`STK Push Resp:`, response);
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
        console.log(response);
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports.createWebhook = async (req, res) => {
    try {
        const eventData = req.body;
        console.log("Webhook Received:", eventData);

        // Extract the payment status and invoice ID
        const { invoice_id, state, userId } = eventData;

        // Update your database (e.g., mark payment as completed)
        await Payment.updateOne({ invoiceId: invoice_id }, { status: state });

        // Get `io` instance from `app.js`
        const io = req.app.get("io");
        const users = req.app.get("users");

        // Send update to the specific user if they are connected
        if (userId && users[userId]) {
            io.to(users[userId]).emit("paymentUpdate", { invoiceId: invoice_id, status: state });
        }

        res.status(200).send("Webhook received successfully");
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).send("Error processing webhook");
    }
}

// module.exports.fetchBusinessPayments = async (req, res) => { 
//     const limit = 3;
//     const user = await User.findById(req.user._id);

//     if(req.body.page) {
//         const pageNumber = req.body.page - 1;
//         const payments = await Payment.find({ seller: user.email })
//             .populate('author')
//             .limit(limit)
//             .skip(limit * pageNumber)

//         const allPayments = await Payment.find({ seller: user.email }).populate('author');

//         const count = allPayments.length;
//         const pages = Math.ceil(count / limit);

//         res.status(200).json({ payments, pages })

//     }
// }