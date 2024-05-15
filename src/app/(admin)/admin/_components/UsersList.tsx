'use client';
import { getCatchErrorMessage } from "@/helpers/ErrorMessages";
import { Table, TableHeader, TableColumn, TableRow, TableCell, getKeyValue, TableBody, Tooltip} from "@nextui-org/react";
import toast from "react-hot-toast";
import axios from "axios";
import React from "react";
import { UserType } from "@/interfaces";
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/LoadersSlice";

function UsersList() {

  const [users, setUsers] = React.useState<UserType[]>([]);

  const dispatch = useDispatch();

  const getUsers = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/admin/users");
      setUsers(response.data.data);

    } catch (error : any) {
      toast.error(getCatchErrorMessage(error));
    } finally {
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  const onEdit = async (id: string) => {
    try {
      dispatch(SetLoading(true));
      await axios.put(`/api/admin/users/${id}`);
      toast.success("Status Updated Successfully");
      getUsers();
      
    } catch (error : any) {
      toast.error(getCatchErrorMessage(error));
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const onDelete = async (id: string) => {
    try {
      dispatch(SetLoading(true));
      await axios.delete(`/api/admin/users/${id}`);
      toast.success("Status Updated Successfully");
      getUsers();
      
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
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Status",
      dataIndex: "isActive",
    },
    {
      title: "Actions",
      dataIndex: "actions",
    },
  ];

  const renderCell = React.useCallback((user:any, columnKey:any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          cellValue.toUpperCase()
        );
      case "isActive":
        return (
          cellValue ? "Active" : "Inactive"
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => {
                onEdit(user._id);
              }}>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onDelete(user._id)}>
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
      <div className="mt-5">
        <Table>
          <TableHeader>
            {columns.map((column) =>
              <TableColumn key={column.dataIndex}>{column.title}</TableColumn>
            )}
          </TableHeader>

          <TableBody emptyContent={"No rows to display."}>
            {users.map((user) =>
              <TableRow key={user._id}>
                {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default UsersList;