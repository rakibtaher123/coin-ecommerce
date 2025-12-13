const express = require('express');
const router = express.Router();
const {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIPN
} = require('../controllers/paymentController');

// Initiate payment
router.post('/initiate', initiatePayment);

// Payment callback routes
router.post('/success', paymentSuccess);
router.post('/fail', paymentFail);
router.post('/cancel', paymentCancel);
router.post('/ipn', paymentIPN);

module.exports = router;
