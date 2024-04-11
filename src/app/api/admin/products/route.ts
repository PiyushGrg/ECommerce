import { connectDB } from "@/config/dbConfig";
import { auth } from "@clerk/nextjs/server";
import Product from "@/models/ProductModel";
import { NextResponse, NextRequest } from "next/server";
import { getMongoUseridFromClerkId } from "@/actions/user";
import User from "@/models/UserModel";
connectDB();

export async function GET(req: NextRequest) {
  try {
    const {userId}=auth();
    const userid=await getMongoUseridFromClerkId(userId!);

    const user =await User.findById(userid);
    if(!user?.isAdmin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const products = await Product.find({}).populate("category");
    return NextResponse.json({ data: products },{status:200});
  } catch (error : any) {
    return NextResponse.json({ message: error.message },{status:500});
  }
}

export async function POST(req: NextRequest) {
  try {
    const {userId}=auth();
    const userid=await getMongoUseridFromClerkId(userId!);

    const user =await User.findById(userid);
    if(!user?.isAdmin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    
    const reqBody = await req.json();
    const product = new Product(reqBody);
    await product.save();
    return NextResponse.json({ data: product },{status:201});
  } catch (error : any) {
    return NextResponse.json({ message: error.message },{status:500});
  }
}
