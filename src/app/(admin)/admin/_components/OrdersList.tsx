"use client";
import { getCatchErrorMessage } from "@/helpers/ErrorMessages";
import {
  Table,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  TableBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import axios from "axios";
import React from "react";
import { Order } from "@/interfaces";
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/LoadersSlice";

function OrdersList() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [status, setStatus] = React.useState<string>("");
  const [order, setOrder] = React.useState<Order | null>(null);

  const dispatch = useDispatch();

  const getOrders = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/admin/orders");
      setOrders(response.data.data);
    } catch (error: any) {
      toast.error(getCatchErrorMessage(error));
    } finally {
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getOrders();
  }, []);

  React.useEffect(() => {
    if (status && order) {
      onEdit(order._id);
    } 
  }, [status, order]);

  const options = [
    {
      key: "awaiting_shipment",
      label: "Awaiting Shipment",
    },
    {
      key: "shipped",
      label: "Shipped",
    },
    {
      key: "delivered",
      label: "Delivered",
    },
  ];

  const onEdit = async (id: string) => {
    try {
      dispatch(SetLoading(true));
      await axios.put(`/api/admin/orders/${id}`, { status });
      toast.success("Status Updated Successfully");
      getOrders();
    } catch (error: any) {
      toast.error(getCatchErrorMessage(error));
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
    },
    {
      title: "Name",
      dataIndex: "userId.name",
    },
    {
      title: "Email",
      dataIndex: "userId.email",
    },
    {
      title: "Phone",
      dataIndex: "userId.phone",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Paid",
      dataIndex: "isPaid",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
    },
  ];

  const renderCell = React.useCallback((order: any, columnKey: any) => {
    let cellValue;
    if (columnKey === "userId.name") {
      cellValue = order.userId.name.toUpperCase();
    } else if (columnKey === "userId.email") {
      cellValue = order.userId.email;
    } else if (columnKey === "userId.phone") {
      cellValue = order.userId.phone;
    } else {
      cellValue = order[columnKey];
    }

    switch (columnKey) {
      case "isPaid":
        return cellValue ? "Paid" : "Not Paid";
      case "status":
        return cellValue === "awaiting_shipment"
          ? "Awaiting Shipment"
          : cellValue === "shipped"
          ? "Shipped"
          : "Delivered";
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">Change Status</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions" items={options}>
              {(item) => (
                <DropdownItem
                  key={item.key}
                  onClick={() => {
                    setStatus(item.key);
                    setOrder(order);
                  }}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
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
            {columns.map((column) => (
              <TableColumn key={column.dataIndex}>{column.title}</TableColumn>
            ))}
          </TableHeader>

          <TableBody emptyContent={"No rows to display."}>
            {orders.map((order) => (
              <TableRow key={order._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(order, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default OrdersList;
