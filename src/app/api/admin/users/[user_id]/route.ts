import { connectDB } from "@/config/dbConfig";
import { auth } from "@clerk/nextjs/server";
import { getMongoUseridFromClerkId } from "@/actions/user";
import User from "@/models/UserModel";
import { NextResponse, NextRequest } from "next/server";
connectDB();

export async function PUT(req: NextRequest,{params}: {params: {user_id: string}} ) {
  try {
    const {userId}=auth();
    const userid=await getMongoUseridFromClerkId(userId!);

    const user =await User.findById(userid);
    if(!user?.isAdmin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    
    await User.updateOne({ _id: params.user_id }, { isActive: true });
    return NextResponse.json({ message: "User updated successfully" },{status:200});
  } catch (error : any) {
    return NextResponse.json({ message: error.message },{status:500});
  }
}

export async function DELETE(req: NextRequest,{params}: {params: {user_id: string}} ) {
  try {
    const {userId}=auth();
    const userid=await getMongoUseridFromClerkId(userId!);

    const user =await User.findById(userid);
    if(!user?.isAdmin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    
    await User.updateOne({ _id: params.user_id }, { isActive: false });
    return NextResponse.json({ message: "User updated successfully" },{status:200});
  } catch (error : any) {
    return NextResponse.json({ message: error.message },{status:500});
  }
}
