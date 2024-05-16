import { connectDB } from "@/config/dbConfig";
import { stripe } from "@/lib/stripe";
import Billing from "@/models/BillingAddress";
import Order from "@/models/OrderModel";
import Shipping from "@/models/ShippingAddress";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

connectDB();
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const billingAddress = session.customer_details!.address;
      const shippingAddress = session.shipping_details!.address;

      const shippingDoc = new Shipping({
        name: session.customer_details!.name!,
        phoneNumber: session.customer_details!.phone!.toString(),
        city: shippingAddress!.city!,
        country: shippingAddress!.country!,
        postalCode: shippingAddress!.postal_code!,
        street: shippingAddress!.line1!,
        state: shippingAddress!.state,
      });
      
      const billingDoc = new Billing({
        name: session.customer_details!.name!,
        phoneNumber: session.customer_details!.phone!.toString(),
        city: billingAddress!.city!,
        country: billingAddress!.country!,
        postalCode: billingAddress!.postal_code!,
        street: billingAddress!.line1!,
        state: billingAddress!.state,
      });
      
      await shippingDoc.save();
      await billingDoc.save();

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: orderId },
        {
          $set: {
            isPaid: true,
            shippingAddress: shippingDoc._id,
            billingAddress: billingDoc._id,
          },
        }
      );
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
