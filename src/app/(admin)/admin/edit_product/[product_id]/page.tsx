"use client";
import React from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import PageTitle from "@/components/PageTitle";
import { useRouter } from "next/navigation";
import ProductForm from "../../_components/ProductForm";
import { deleteImages, uploadImages } from "@/helpers/imageUploadAndDelete";
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/LoadersSlice";

function EditProduct({ params }: { params: any }) {

  const [files, setFiles] = React.useState<any>([]);
  const id = params.product_id;
  const [product, setProduct] = React.useState<any>(null);
  
  const dispatch = useDispatch();
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      dispatch(SetLoading(true));

      // delete images
      const imagesToDelete = product.images.filter(
        (image: string) => !values.images.includes(image)
      );
      await deleteImages(imagesToDelete);
      const newImagesUploaded = await uploadImages(files);
      values.images = [...values.images, ...newImagesUploaded];
      await axios.put(`/api/admin/products/${id}`, values);
      toast.success("Product Updated Successfully");
      router.push("/admin?tab=products");
      router.refresh();

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const getProduct = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get(`/api/admin/products/${id}`);
      setProduct(response.data.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getProduct();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Edit Product" />

        <div className="flex gap-5">
          <Button
            onClick={() => {
              router.push("/admin?tab=products");
            }}
          >
            Cancel
          </Button>
          {/* <Button color="primary" type="submit">
            Save
          </Button> */}
        </div>
      </div>
      {product && (
        <ProductForm
          onFinish={onFinish}
          initialValues={product}
          files={files}
          setFiles={setFiles}
        />
      )}
    </div>
  );
}

export default EditProduct;
