import crypto from 'crypto';
import Razorpay from 'razorpay';

// Endpoint to send Razorpay credentials (Not recommended for frontend exposure)
const config = (req, res) =>
  res.send({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET
  });

// Endpoint to create an order using Razorpay
const order = async (req, res, next) => {
  try {
    // Initialize Razorpay instance with credentials
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = req.body;

    // Create order with provided options
    const order = await razorpay.orders.create(options);

    if (!order) {
      res.statusCode = 500;
      throw new Error('No order');
    }

    res.status(201).json(order);
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
};

// Endpoint to validate the payment signature
const validate = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // Generate HMAC SHA256 signature using Razorpay secret
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  // Compare the generated signature with the received one
  if (generatedSignature !== razorpay_signature) {
    res.statusCode = 400;
    throw new Error('payment is not legit!');
  }

  res.status(201).json({
    id: razorpay_payment_id,
    status: 'success',
    message: 'payment is successful',
    updateTime: new Date().toLocaleTimeString() // Log payment time
  });
};

export { config, order, validate };
