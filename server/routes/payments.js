const express = require('express');
const router = express.Router();
const payments = require('../controllers/payments');
const { isLoggedIn, isBusiness } = require('../middleware');


router.post('/makepay', isLoggedIn, payments.createPayment);
router.get('/status/:invoiceId', isLoggedIn, payments.getPaymentStatus);

router.post('/search/page', isLoggedIn, payments.fetchBusinessPayments);

router.post('/transactions/search/page', isLoggedIn, payments.fetchUserTransactions);
router.put('/transactions/:txId/disputeTransaction', isLoggedIn, payments.disputeTransaction);

module.exports = router;