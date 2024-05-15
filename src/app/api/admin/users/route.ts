import { getMongoUseridFromClerkId } from "@/actions/user";
import { connectDB } from "@/config/dbConfig";
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

    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data: users },{status: 200});

  } catch (error : any) {
    return NextResponse.json({ message: error.message } , { status: 500 });
  }
}
