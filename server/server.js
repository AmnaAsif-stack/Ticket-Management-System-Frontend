const express = require('express');
const cors = require('cors'); // Import the cors package
require('dotenv').config();  // This ensures the .env file is loaded
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Enable CORS for all origins (or restrict to specific origins)
app.use(cors());

app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
  console.log(process.env.STRIPE_SECRET_KEY);  // This should print your Stripe secret key

});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
