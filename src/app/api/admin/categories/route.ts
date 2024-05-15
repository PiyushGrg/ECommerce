import { getMongoUseridFromClerkId } from "@/actions/user";
import { connectDB } from "@/config/dbConfig";
import Category from "@/models/CategoryModel";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/UserModel";
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

    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data: categories },{status: 200});

  } catch (error : any) {
    return NextResponse.json({ message: error.message } , { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {userId} = auth();
    const userid = await getMongoUseridFromClerkId(userId!);

    const user = await User.findById(userid);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: "Not authorized" },{status: 401});
    }

    const reqBody = await req.json();
    const category = new Category(reqBody);
    await category.save();
    return NextResponse.json({ data: category },{status: 201}); 
    
  } catch (error : any) {
    return NextResponse.json({ message: error.message } , { status: 500 });
  }
}
