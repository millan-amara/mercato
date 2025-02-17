const express = require('express');
const router = express.Router();
const payments = require('../controllers/payments');
const { isLoggedIn, isBusiness } = require('../middleware');


router.post('/makepay', isLoggedIn, payments.createPayment);
router.post('/intasend-webhook', payments.createWebhook);
router.get('/payment-status/:invoiceId', isLoggedIn, payments.getPaymentStatus);

// router.post('/search/page', isLoggedIn, payments.fetchBusinessPayments);

 
module.exports = router;