"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TransactedRateTable from "@/components/tables/transacted-rate-table";

export default function TransactedRatesContainer() {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Transacted Rates</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Transacted Exchange Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactedRateTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
