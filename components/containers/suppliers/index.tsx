"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mutate } from "swr";
import { AddNewSupplier } from "@/components/dialogs/add-new-supplier";
import SupplierTable from "@/components/tables/supplier-table";

const SupplierContainer = () => {
  const handleSubmit = async () => {
    await revalidateAll();
  };

  const revalidateAll = async () => {
    await mutate(
      (key) => typeof key === "string" && key.startsWith("/suppliers"),
      undefined,
      { revalidate: true },
    );
  };
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Suppliers Management
        </p>
        <AddNewSupplier onSuccess={handleSubmit} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplierTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierContainer;
