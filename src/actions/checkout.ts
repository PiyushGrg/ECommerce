'use server'
import { connectDB } from '@/config/dbConfig'
import { stripe } from '@/lib/stripe'
import Order from '@/models/OrderModel';
import { currentUser } from '@clerk/nextjs';
import { getMongoUseridFromClerkId } from './user';

connectDB();

export const createCheckoutSession = async ({orderId}: {
  orderId: string
}) => {
    
  const order = await Order.findById(orderId).populate('products');

  if (!order) {
    throw new Error('No such order found')
  }

  const userData = await currentUser();
  const clerkUserId = userData?.id;

  const mongoId = await getMongoUseridFromClerkId(clerkUserId!);

  const product = await stripe.products.create({
    name: 'Ecom Shopping',
    images: [order.products[0].images[0]],
    default_price_data: {
      currency: 'INR',
      unit_amount: order.amount * 100,
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order._id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    payment_method_types: ['card'],
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['IN'] },
    phone_number_collection: { enabled: true },
    metadata: {
      userId: mongoId.toString(),
      orderId: (order._id).toString(),
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  })

  return { url: stripeSession.url }
}