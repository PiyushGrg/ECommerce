import { antdFieldValidation, getCatchErrorMessage } from "@/helpers/ErrorMessages";
import { Form, Upload } from "antd";
import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/LoadersSlice";

interface ProductFormProps {
    onFinish: any;
    initialValues?: any;
    files?: any;
    setFiles?: any;
}

function ProductForm({ onFinish, initialValues, files, setFiles }: ProductFormProps) {

    const [images, setImages] = React.useState<any>(
        initialValues?.images || []
    );
    const [categories, setCategories] = React.useState<any>([]);
    
    const dispatch = useDispatch();

    const getCategories = async () => {
        try {
            dispatch(SetLoading(true));
            const response = await axios.get("/api/admin/categories");
            setCategories(response.data.data);

        } catch (error: unknown) {
            toast.error(getCatchErrorMessage(error));
        } finally {
            dispatch(SetLoading(false));
        }
    };

    React.useEffect(() => {
        getCategories();
    }, []);

    return (
        <Form
            layout="vertical"
            onFinish={(values) =>
                onFinish({
                    ...values,
                    images,
                })
            }
            initialValues={initialValues}
        >
            <div className="grid grid-cols-3 mt-5 gap-5">
                <div className="col-span-3">
                    <Form.Item name="name" rules={antdFieldValidation}>
                        <Input 
                            label="Name"
                            labelPlacement="outside"
                            placeholder="Enter product name"
                        />
                    </Form.Item>
                </div>
                <div className="col-span-3">
                    <Form.Item
                        name="description"
                        rules={antdFieldValidation}
                    >
                        <Textarea
                            label="Description"
                            labelPlacement="outside"
                            placeholder="Enter description"
                        />
                    </Form.Item>
                </div>

                <Form.Item name="price" rules={antdFieldValidation}>
                    <Input 
                        label="Price"
                        labelPlacement="outside"
                        placeholder="Enter per unit price"
                        type="number"
                    />
                </Form.Item>
                <Form.Item name="category" rules={antdFieldValidation}>
                    <Select 
                        label="Select Category"
                        labelPlacement="outside"
                        defaultSelectedKeys={[initialValues?.category._id]}
                    >
                        {categories.map((category: any) => (
                            <SelectItem key={category._id} value={category._id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="countInStock"
                    rules={antdFieldValidation}
                >
                    <Input 
                        label="Count In Stock"
                        labelPlacement="outside"
                        placeholder="Enter count in stock"
                        type="number"
                    />
                </Form.Item>

                <div className="col-span-3">
                    <Upload
                        accept="image/*"
                        multiple
                        beforeUpload={(file) => {
                            setFiles((prev: any) => [...prev, file]);
                            return false;
                        }}
                        listType="picture-card"
                    >
                        Upload Images
                    </Upload>
                </div>

                <div className="flex gap-5">
                    {images.map((image: any, index: number) => (
                        <div
                            key={index}
                            className="p-5 border-solid border border-gray-300 rounded-md overflow-hidden flex flex-col items-center justify-center gap-2"
                        >
                            <Image
                                className="w-20 h-20 object-cover"
                                src={image}
                                alt={image}
                                width={80}
                                height={80}
                            />

                            <span
                                className="underline cursor-pointer text-gray-600"
                                onClick={() => {
                                    setImages((prev: any) => {
                                        const temp = [...prev];
                                        temp.splice(index, 1);
                                        return temp;
                                    });
                                }}
                            >
                                Remove
                            </span>
                        </div>
                    ))}
                </div>

                <div className="col-span-3 flex justify-end">
                    <Button color="primary" type="submit">
                        Save
                    </Button>
                </div>
            </div>
        </Form>
    );
}

export default ProductForm;

