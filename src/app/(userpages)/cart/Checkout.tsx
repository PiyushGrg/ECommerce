'use client';
import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51OY3dTSJh0wyJGbP3mJ63i4M3I6pcPOCMVfhwPiN7aBtctzzbJUMPjMaPwtnTVLoqSpdRoVFe3DygfGXXoBdy4db00GsUrSf1W"
);

export default function Checkout() {
    
  const [clientSecret, setClientSecret] = React.useState("");

  useEffect(() => {
    axios.post("/api/stripe_client_secret").then((res) => {
      setClientSecret(res.data);
    });
  }, []);

  return (
    clientSecret && (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 my-5">Checkout</h1>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: clientSecret,
          }}
        >
          <CheckoutForm />
        </Elements>
      </div>
    )
  );
}
