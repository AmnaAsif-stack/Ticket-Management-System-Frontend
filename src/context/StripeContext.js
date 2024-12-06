// StripeContext.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Your Stripe publishable key
const stripePromise = loadStripe('pk_test_51QQtJrGVhVkfmBm60vWAByASAlcmgS34BftiIulgxMBXDova0N7F2Kse4SoXZAhWyRnxtcNT0Rxw35t9AczGPOpU00SXlRTdvK');

export const StripeContext = ({ children }) => (
  <Elements stripe={stripePromise}>
    {children}
  </Elements>
);
