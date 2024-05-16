import { getMongoUseridFromClerkId } from "@/actions/user";
import { connectDB } from "@/config/dbConfig";
import Order from "@/models/OrderModel";
import User from "@/models/UserModel";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
connectDB();

export async function GET(req: NextRequest) {
  try {
    const {userId} = auth();
    const userid = await getMongoUseridFromClerkId(userId!);

    const user = await User.findById(userid);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: "Not authorized" },{status: 401});
    }

    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("userId");
    return NextResponse.json({ data: orders },{status: 200});

  } catch (error : any) {
    return NextResponse.json({ message: error.message } , { status: 500 });
  }
}
