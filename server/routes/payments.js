const express = require('express');
const router = express.Router();
const payments = require('../controllers/payments');
const { isLoggedIn, isBusiness } = require('../middleware');


router.post('/makepay', isLoggedIn, payments.createPayment);
router.get('/status/:invoiceId', isLoggedIn, payments.getPaymentStatus);

router.post('/recharge', isLoggedIn, payments.rechargeCoins);
router.get('/recharge/status/:invoiceId', isLoggedIn, payments.getRechargeStatus);
router.post('/recharge/search/page', isLoggedIn, payments.fetchRechargeHistory);

router.post('/search/page', isLoggedIn, payments.fetchBusinessPayments);
router.get('/search/page/totals', isLoggedIn, payments.fetchBusinessTotals);

router.post('/transactions/search/page', isLoggedIn, payments.fetchUserTransactions);
router.get('/transactions/admin/search/page', isLoggedIn, payments.fetchAllTransactions);
router.put('/transactions/:txId/disputeTransaction', isLoggedIn, payments.disputeTransaction);
router.put('/transactions/:txId/approveTransaction', isLoggedIn, payments.approveTransaction);

module.exports = router;