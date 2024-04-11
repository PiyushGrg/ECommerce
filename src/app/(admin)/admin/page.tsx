"use client";
import React from "react";
import { Tabs,Tab } from "@nextui-org/react";
import CategoriesList from "./_components/CategoriesList";
import OrdersList from "./_components/OrdersList";
import ProductsList from "./_components/ProductsList";
import UsersList from "./_components/UsersList";
import { useRouter } from "next/navigation";

function AdminProfile() {

  const router = useRouter();

  return (
    <div>
      <Tabs
        color="primary"
        variant="underlined"
        size="lg"
        fullWidth
        radius="full"
        onSelectionChange={(key) => {
          router.push(`/admin?tab=${key}`);
        }}
      >
        <Tab title="Products" key="products">
            <ProductsList />
        </Tab>

        <Tab title="Categories" key="categories">
            <CategoriesList />
        </Tab>

        <Tab title="Orders" key="orders">
            <OrdersList />
        </Tab>

        <Tab title="Users" key="users">
            <UsersList />
        </Tab>
        
      </Tabs>
    </div>
  );
}

export default AdminProfile;
