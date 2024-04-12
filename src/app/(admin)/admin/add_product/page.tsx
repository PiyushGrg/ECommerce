"use client";
import React from "react";
import ProductForm from "../_components/ProductForm";
import axios from "axios";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import PageTitle from "@/components/PageTitle";
import { useRouter } from "next/navigation";
import { uploadImages } from "@/helpers/imageUploadAndDelete";

function AddProduct() {

  const [files, setFiles] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  
  const onFinish = async (values: any) => {
    try {
        setLoading(true);
        values.images = await uploadImages(files);
        await axios.post("/api/admin/products", values);
        toast.success("Product Added Successfully");
        router.push("/admin?tab=products");
        router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Add Product" />

        <div className="flex gap-5">
          <Button
            onClick={() => {
              router.push("/admin?tab=products");
            }}
          >
            Cancel
          </Button>
          {/* <Button color="primary" onClick={onFinish}>
            Save
          </Button> */}
        </div>
      </div>
      <ProductForm onFinish={onFinish} files={files} setFiles={setFiles} />
    </div>
  );
}

export default AddProduct;
