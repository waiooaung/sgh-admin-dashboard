"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { ExchangeRateCard } from "@/components/forms/exchange-rate-card";
import TransactionTable from "@/components/tables/transaction-table";
import DisplayProfitOverview from "@/components/overviews/display-profit-overview";
import DashboardTransactionOverview from "@/components/overviews/dashboard/transaction-overview";
import DashboardAgentOverview from "@/components/overviews/dashboard/agent-overview";
import DashboardSupplierOverview from "@/components/overviews/dashboard/supplier-overview";
import DashboardChart from "@/components/charts/dashboard-chart";

export default function DashboardContainer() {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Hi, Welcome back 👋
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DisplayProfitOverview />
        <DashboardAgentOverview />
        <DashboardSupplierOverview />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <DashboardTransactionOverview />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ExchangeRateCard
          defaultDateFrom={new Date()}
          defaultDateTo={new Date()}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <DashboardChart />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Transactions <span>( Today )</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable
              defaultDateFrom={new Date()}
              defaultDateTo={new Date()}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
