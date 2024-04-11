import { connectDB } from "@/config/dbConfig";
import { auth } from "@clerk/nextjs/server";
import { getMongoUseridFromClerkId } from "@/actions/user";
import User from "@/models/UserModel";
import Product from "@/models/ProductModel";
import { NextResponse, NextRequest } from "next/server";
connectDB();

export async function GET(req: NextRequest,{params}: {params: {product_id: string}} ) {
  try {
    const {userId}=auth();
    const userid=await getMongoUseridFromClerkId(userId!);

    const user =await User.findById(userid);
    if(!user?.isAdmin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const product = await Product.findById(params.product_id);
    return NextResponse.json({ data: product },{status:200});
  } catch (error : any) {
    return NextResponse.json({ message: error.message },{status:500});
  }
}

export async function PUT(req: NextRequest,{params}: {params: {product_id: string}} ) {
  try {
    const {userId}=auth();
    const userid=await getMongoUseridFromClerkId(userId!);

    const user =await User.findById(userid);
    if(!user?.isAdmin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    
    const reqBody = await req.json();
    await Product.updateOne({ _id: params.product_id }, reqBody);
    return NextResponse.json({ message: "Product updated successfully" },{status:200});
  } catch (error : any) {
    return NextResponse.json({ message: error.message },{status:500});
  }
}

export async function DELETE(req: NextRequest,{params}: {params: {product_id: string}} ) {
  try {
    const {userId}=auth();
    const userid=await getMongoUseridFromClerkId(userId!);

    const user =await User.findById(userid);
    if(!user?.isAdmin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    
    await Product.deleteOne({ _id: params.product_id });
    return NextResponse.json({ message: "Product deleted successfully" },{status:200});
  } catch (error : any) {
    return NextResponse.json({ message: error.message },{status:500});
  }
}
