"use client";
import React from "react";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function CheckoutForm() {

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      if (!stripe || !elements) throw new Error("Stripe.js hasn't loaded yet.");

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw result.error.message;
      }

      toast.success("Payment successful");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement
        options={{
          allowedCountries: ["IN"],
          mode: "shipping",
        }}
      />
      <Button color="primary" type="submit" className="mt-5">
        Pay
      </Button>
    </form>
  );
}

export default CheckoutForm;
