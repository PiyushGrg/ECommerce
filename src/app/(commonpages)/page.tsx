import { handleUserRegister } from "@/actions/user";
import { connectDB } from "@/config/dbConfig";
import Link from "next/link";
import Image from "next/image";
import Searchbar from "./_components/Searchbar";
import Product from "@/models/ProductModel";

connectDB();


function getProductName(name: string) {
  const nameArray = name.split(" ");
  const productName = nameArray.slice(0, 3).join(" ");
  return productName;
}

export default async function Home({ searchParams }: { searchParams: any }) {

  await handleUserRegister();

  const {search} = searchParams;
  const products = await Product.find({
    $or: [
      { name: { $regex: search || "", $options: "i" } },
      { description: { $regex: search || "", $options: "i" } },
    ]
  }).populate("category");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
      <h1 className="text-2xl font-semibold text-gray-700 col-span-6 mt-5">
        Products
      </h1>
      <div className="col-span-6">
        <Searchbar />
      </div>
      {products &&
        products?.length > 0 &&
        products.map((product: any) => (
          <Link href={`/products/${product._id}`} key={product._id}>
            <div
              key={product._id}
              className="flex flex-col items-center justify-center gap-2 p-4 border-gray-300 border border-solid cursor-pointer hover:border-gray-400"
            >
              <Image
                src={product.images[0]}
                alt={""}
                width={150}
                height={150}
              />
              <h1 className="text-sm text-gray-500 truncate">
                {getProductName(product.name)}
              </h1>
              <h1 className="text-lg font-semibold text-gray-700">
                Rs {product.price}
              </h1>
            </div>
          </Link>
        ))}
    </div>
  );
}

