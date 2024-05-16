'use server';
import { connectDB } from "@/config/dbConfig";
import { ProductType } from "@/interfaces";
import { currentUser } from "@clerk/nextjs";
import { getMongoUseridFromClerkId } from "./user";
import Order from "@/models/OrderModel";
import ConfigQuant from "@/models/ConfigQuantity";

connectDB();

export const createOrder = async ({ items, cartPrice }: { items: ProductType[], cartPrice: number }) => {
    try {
        const userData = await currentUser();
        const clerkUserId = userData?.id;

        const mongoId = await getMongoUseridFromClerkId(clerkUserId!);

        const order = new Order({
            userId: mongoId,
            amount: cartPrice,
            products: items,
        });

        await order.save();

        for (let item of items) {
            const configQuant = new ConfigQuant({
                product: item._id,
                orderId: order._id,
                quantity: item.quantity
            });

            await configQuant.save();
        }

        return JSON.parse(JSON.stringify({ order }));
    } catch (error:any) {
        throw new Error(error.message);
    }
}