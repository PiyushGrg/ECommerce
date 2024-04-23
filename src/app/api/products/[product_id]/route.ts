import { connectDB } from "@/config/dbConfig";
import Product from "@/models/ProductModel";
import { NextResponse, NextRequest } from "next/server";

connectDB();

export async function GET(req: NextRequest,{params}: {params: {product_id: string}} ) {
  try {
    const product = await Product.findById(params.product_id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error : any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
