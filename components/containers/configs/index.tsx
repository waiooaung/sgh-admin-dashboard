"use client";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { ExchangeRateForm } from "@/components/forms/exchange-rate-form";
import { CommissionRateForm } from "@/components/forms/commission-rate-form";
// import TransactionTypeTable from "@/components/tables/transaction-type-table";
// import { AddTransactionType } from "@/components/dialogs/add-transaction-type";
// import { mutate } from "swr";

export default function ConfigsContainer() {
  // const handleSubmit = async () => {
  //   await mutate(
  //     (key) => typeof key === "string" && key.startsWith("/transaction-types"),
  //     undefined,
  //     { revalidate: true },
  //   );
  // };
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExchangeRateForm />
        <CommissionRateForm />
      </div>

      {/* <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaction Types</CardTitle>
            <AddTransactionType onSuccess={handleSubmit} />
          </CardHeader>
          <CardContent>
            <TransactionTypeTable />
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
