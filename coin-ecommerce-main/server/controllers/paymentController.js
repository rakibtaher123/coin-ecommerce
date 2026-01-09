const SSLCommerzPayment = require('sslcommerz-lts');

// SSLCommerz Test Credentials (Sandbox for testing)
const store_id = 'testbox';  // Test Store ID
const store_passwd = 'qwerty';  // Test Store Password
const is_live = false; // false for sandbox/testing

// Initialize Payment
exports.initiatePayment = async (req, res) => {
    try {
        const { amount, orderInfo, customerInfo } = req.body;

        const tran_id = 'ORD_' + Date.now(); // Unique transaction ID

        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: `https://gangaridai-auction.onrender.com/api/payment/success`,
            fail_url: `https://gangaridai-auction.onrender.com/api/payment/fail`,
            cancel_url: `https://gangaridai-auction.onrender.com/api/payment/cancel`,
            ipn_url: `https://gangaridai-auction.onrender.com/api/payment/ipn`,
            shipping_method: 'Courier',
            product_name: orderInfo.productName || 'Coins',
            product_category: 'Collectibles',
            product_profile: 'general',
            cus_name: customerInfo.name,
            cus_email: customerInfo.email,
            cus_add1: customerInfo.address,
            cus_add2: customerInfo.city,
            cus_city: customerInfo.city,
            cus_state: customerInfo.city,
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: customerInfo.phone,
            cus_fax: customerInfo.phone,
            ship_name: customerInfo.name,
            ship_add1: customerInfo.address,
            ship_add2: customerInfo.city,
            ship_city: customerInfo.city,
            ship_state: customerInfo.city,
            ship_postcode: '1000',
            ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

        const apiResponse = await sslcz.init(data);

        console.log('SSLCommerz Response:', apiResponse);

        if (apiResponse.GatewayPageURL) {
            res.json({
                success: true,
                gatewayUrl: apiResponse.GatewayPageURL,
                tran_id: tran_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment gateway initialization failed'
            });
        }
    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
            error: error.message
        });
    }
};

// Payment Success Handler
exports.paymentSuccess = async (req, res) => {
    try {
        console.log('Payment Success:', req.body);

        // TODO: Save order to database here
        // TODO: Update order status to 'paid'

        // Redirect to frontend success page
        res.redirect(`https://gangaridai-auction.vercel.app/payment-success?tran_id=${req.body.tran_id}`);
    } catch (error) {
        console.error('Success Handler Error:', error);
        res.redirect('https://gangaridai-auction.vercel.app/payment-failed');
    }
};

// Payment Failure Handler
exports.paymentFail = async (req, res) => {
    try {
        console.log('Payment Failed:', req.body);

        // Redirect to frontend failure page
        res.redirect(`https://gangaridai-auction.vercel.app/payment-failed?reason=${req.body.error || 'unknown'}`);
    } catch (error) {
        console.error('Fail Handler Error:', error);
        res.redirect('https://gangaridai-auction.vercel.app/payment-failed');
    }
};

// Payment Cancel Handler
exports.paymentCancel = async (req, res) => {
    try {
        console.log('Payment Cancelled:', req.body);

        // Redirect to frontend with cancel message
        res.redirect('https://gangaridai-auction.vercel.app/payment-failed?reason=cancelled');
    } catch (error) {
        console.error('Cancel Handler Error:', error);
        res.redirect('https://gangaridai-auction.vercel.app/payment-failed');
    }
};

// IPN (Instant Payment Notification) Handler
exports.paymentIPN = async (req, res) => {
    try {
        console.log('IPN Received:', req.body);

        // TODO: Validate IPN
        // TODO: Update order status

        res.sendStatus(200);
    } catch (error) {
        console.error('IPN Handler Error:', error);
        res.sendStatus(500);
    }
};
