import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";

import CheckoutForm from "./CheckoutForm";
import "../Stripe.css";
import { selectCurrentOrder } from "../features/order/orderSlice";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51Q3tVEGEBxbpssiuMZxypz0oUFwy61tl2whdhIxOJHwbFSIv5JKjKVTMMysTVWzWqFsZysBlzabJ7fKJQPsE8Ydz002n5WPPIY"
);

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const currentOrder = useSelector(selectCurrentOrder);


  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
  
    fetch("/create-payment-intent", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalAmount: currentOrder.totalAmount,
        orderId: currentOrder.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Client Secret:", data.clientSecret); // Add this line to verify clientSecret
        setClientSecret(data.clientSecret);
      });
  }, [currentOrder]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="Stripe">
      {clientSecret && (
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
      {!clientSecret && <p>Loading Payment Options...</p>}
    </div>
  );
}
