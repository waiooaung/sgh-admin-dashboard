"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AddNewTransaction } from "@/components/dialogs/add-new-transaction";
import TransactionTable from "@/components/tables/transaction-table";
import TransactionOverview from "@/components/overviews/transaction-overview";
import { mutate } from "swr";

const TransactionContainer = () => {
  const revalidateAll = async () => {
    await mutate("/dashboard/transaction-statistics", undefined, {
      revalidate: true,
    });
    await mutate(
      (key) => typeof key === "string" && key.startsWith("/transactions"),
      undefined,
      { revalidate: true },
    );
  };

  const handleSubmit = async () => {
    await revalidateAll();
  };
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Transactions</p>
        <AddNewTransaction onSuccess={handleSubmit} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <TransactionOverview />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionContainer;
