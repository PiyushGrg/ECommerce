import { connectDB } from "@/config/dbConfig";
import { auth } from "@clerk/nextjs/server";
import { getMongoUseridFromClerkId } from "@/actions/user";
import User from "@/models/UserModel";
import { NextResponse, NextRequest } from "next/server";
import Order from "@/models/OrderModel";
connectDB();

export async function PUT(req: NextRequest,{params}: {params: {order_id: string}} ) {
  try {
    const {userId}=auth();
    const userid=await getMongoUseridFromClerkId(userId!);

    const user =await User.findById(userid);
    if(!user?.isAdmin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const {status} = await req.json();
    
    await Order.findByIdAndUpdate({ _id: params.order_id }, { status });
    return NextResponse.json({ message: "Order updated successfully" },{status:200});
  } catch (error : any) {
    return NextResponse.json({ message: error.message },{status:500});
  }
}