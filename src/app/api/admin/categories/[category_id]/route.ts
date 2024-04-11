import { getMongoUseridFromClerkId } from "@/actions/user";
import { connectDB } from "@/config/dbConfig";
import Category from "@/models/CategoryModel";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/UserModel";
import { NextResponse, NextRequest } from "next/server";
connectDB();

export async function GET(req: NextRequest,{params}: {params: {category_id: string}} ) {
    try {
        const {userId} = auth();
        const userid = await getMongoUseridFromClerkId(userId!);

        const user = await User.findById(userid);
        if (!user?.isAdmin) {
        return NextResponse.json({ message: "Not authorized" },{status: 401});
        }

        const category = await Category.findById(params.category_id);
        return NextResponse.json({ data: category }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message },{status: 500});
    }
}

export async function PUT(req: NextRequest,{ params }: { params: { category_id: string } }) {
    try {
        const {userId} = auth();
        const userid = await getMongoUseridFromClerkId(userId!);

        const user = await User.findById(userid);
        if (!user?.isAdmin) {
        return NextResponse.json({ message: "Not authorized" },{status: 401});
        }

        const reqBody = await req.json();
        await Category.updateOne({ _id: params.category_id }, reqBody);
        return NextResponse.json({ message: "category updated successfully" },{status: 200});

    } catch (error: any) {
        return NextResponse.json({ message: error.message },{status: 500});
    }
}

export async function DELETE(req: NextRequest,{ params }: { params: { category_id: string } } ) {
    try {
        const {userId} = auth();
        const userid = await getMongoUseridFromClerkId(userId!);

        const user = await User.findById(userid);
        if (!user?.isAdmin) {
        return NextResponse.json({ message: "Not authorized" },{status: 401});
        }

        await Category.deleteOne({ _id: params.category_id });
        return NextResponse.json({ message: "category deleted successfully" },{status: 200});

    } catch (error: any) {
        return NextResponse.json({ message: error.message },{status: 500});
    }
}
