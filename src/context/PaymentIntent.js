import axios from 'axios';

const createPaymentIntent = async (amount) => {
    try {
      // Make request to create payment intent
      const response = await axios.post('http://localhost:3001/create-payment-intent', { amount });
  
      console.log('Received response from backend:', response.data);  // Log the full response
  
      // Extract clientSecret from the response
      const clientSecret = response.data.clientSecret;
  
      if (!clientSecret) {
        throw new Error('Client secret is missing');
      }
  
      return clientSecret;  // Return the clientSecret for the next step
    } catch (error) {
      console.error('Error creating payment intent:', error.message);
      throw new Error('Payment Intent creation failed');
    }
  };
  
  