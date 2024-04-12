"use client";
import { Button, Table, TableHeader, TableColumn, TableRow, TableCell, getKeyValue, TableBody, Tooltip } from "@nextui-org/react";
import toast from "react-hot-toast";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCatchErrorMessage } from "@/helpers/ErrorMessages";
import axios from "axios";
import { ProductType } from "@/interfaces";
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';

function ProductsList() {

  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/products");
      setProducts(response.data.data);

    } catch (error : any) {
      toast.error(getCatchErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/admin/products/${id}`);
      toast.success("Product Deleted Successfully");
      getProducts();

    } catch (error : any) {
      toast.error(getCatchErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Count In Stock",
      dataIndex: "countInStock",
    },
    {
      title: "Actions",
      dataIndex: "actions",
    },
  ];


  const renderCell = React.useCallback((product:any, columnKey:any) => {
    let cellValue;
    if(columnKey === "category"){
      cellValue = product[columnKey]?.name || "No Category";
    }
    else{
      cellValue = product[columnKey];
    }

    switch (columnKey) {
      case "name":
        return (
          cellValue
        );
      case "price":
        return (
          cellValue
        );
      case "category":
        return (
          cellValue
        );
      case "countInStock":
        return (
          cellValue
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => router.push(`/admin/edit_product/${product._id}`)}>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onDelete(product._id)}>
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);


  return (
    <div>
      <div className="flex justify-end">
        <Button
          color="primary"
          onClick={() => router.push("/admin/add_product")}
        >
          Add Product
        </Button>
      </div>

      <div className="mt-5">
        <Table>
          <TableHeader>
            {columns.map((column) =>
              <TableColumn key={column.dataIndex}>{column.title}</TableColumn>
            )}
          </TableHeader>

          <TableBody emptyContent={"No rows to display."}>
            {products.map((product) =>
              <TableRow key={product._id}>
                {(columnKey) => <TableCell>{renderCell(product, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ProductsList;
