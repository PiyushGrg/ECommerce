'use client';
import { getCatchErrorMessage } from "@/helpers/ErrorMessages";
import { Button, Table, TableHeader, TableColumn, TableRow, TableCell, getKeyValue, TableBody, Tooltip} from "@nextui-org/react";
import toast from "react-hot-toast";
import axios from "axios";
import React from "react";
import CategoryForm from "./CategoryForm";
import { CategoryType } from "@/interfaces";
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/LoadersSlice";

function CategoriesList() {

  const [showCategoryForm, setShowCategoryForm] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryType>();
  const [categories, setCategories] = React.useState<CategoryType[]>([]);

  const dispatch = useDispatch();

  const getCategories = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/admin/categories");
      setCategories(response.data.data);

    } catch (error : any) {
      toast.error(getCatchErrorMessage(error));
    } finally {
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  const onDelete = async (id: string) => {
    try {
      dispatch(SetLoading(true));
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success("Category Deleted Successfully");
      getCategories();
      
    } catch (error : any) {
      toast.error(getCatchErrorMessage(error));
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Actions",
      dataIndex: "actions",
    },
  ];

  const renderCell = React.useCallback((category:any, columnKey:any) => {
    const cellValue = category[columnKey];

    switch (columnKey) {
      case "name":
        return (
          cellValue
        );
      case "description":
        return (
          cellValue
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => {
                setSelectedCategory(category);
                setShowCategoryForm(true);
              }}>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onDelete(category._id)}>
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
          onClick={() => {
            setShowCategoryForm(true);
            setSelectedCategory(undefined);
          }}
        >
          Add Category
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
            {categories.map((category) =>
              <TableRow key={category._id}>
                {(columnKey) => <TableCell>{renderCell(category, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showCategoryForm && (
        <CategoryForm
          showCategoryForm={showCategoryForm}
          setShowCategoryForm={setShowCategoryForm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          reloadCategories={getCategories}
        />
      )}
    </div>
  );
}

export default CategoriesList;
