"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ExchangeRateCard } from "@/components/cards/exchange-rate-card";
import { CommissionRateCard } from "@/components/cards/commission-rate-card";
import TransactionTable from "@/components/tables/transaction-table";
import DashboardTransactionOverview from "@/components/overviews/dashboard/transaction-overview";
import DashboardAgentOverview from "@/components/overviews/dashboard/agent-overview";
import DashboardSupplierOverview from "@/components/overviews/dashboard/supplier-overview";

export default function DashboardContainer() {
  const profitData = [
    { date: "Feb 1", profit: 150.25 },
    { date: "Feb 2", profit: 300.75 },
    { date: "Feb 3", profit: 250.6 },
    { date: "Feb 4", profit: 450.1 },
    { date: "Feb 5", profit: 600.55 },
    { date: "Feb 6", profit: 500.9 },
    { date: "Feb 7", profit: 700.3 },
    { date: "Feb 8", profit: 850.45 },
    { date: "Feb 9", profit: 900.8 },
    { date: "Feb 10", profit: 750.25 },
    { date: "Feb 11", profit: 950.7 },
    { date: "Feb 12", profit: 1100.95 },
    { date: "Feb 13", profit: 1300.15 },
    { date: "Feb 14", profit: 1200.4 },
    { date: "Feb 15", profit: 1400.65 },
    { date: "Feb 16", profit: 1550.85 },
    { date: "Feb 17", profit: 1650.05 },
    { date: "Feb 18", profit: 1750.35 },
    { date: "Feb 19", profit: 1800.5 },
    { date: "Feb 20", profit: 1950.75 },
    { date: "Feb 21", profit: 2100.95 },
    { date: "Feb 22", profit: 2250.6 },
    { date: "Feb 23", profit: 2400.3 },
    { date: "Feb 24", profit: 2600.4 },
    { date: "Feb 25", profit: 2750.9 },
    { date: "Feb 26", profit: 2900.15 },
    { date: "Feb 27", profit: 3100.25 },
    { date: "Feb 28", profit: 3300.75 },
  ];

  const transactionData = [
    { date: "Oct 1", transactions: 10.0 },
    { date: "Oct 2", transactions: 20.0 },
    { date: "Oct 3", transactions: 15.0 },
    { date: "Oct 4", transactions: 25.0 },
    { date: "Oct 5", transactions: 30.0 },
    { date: "Oct 6", transactions: 22.5 },
    { date: "Oct 7", transactions: 18.0 },
    { date: "Oct 8", transactions: 27.0 },
    { date: "Oct 9", transactions: 35.0 },
    { date: "Oct 10", transactions: 40.0 },
  ];

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Hi, Welcome back 👋
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <DashboardTransactionOverview />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardAgentOverview />
        <DashboardSupplierOverview />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExchangeRateCard />
        <CommissionRateCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Profit Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="transactions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Transactions <span>( Today )</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable from={new Date()} to={new Date()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
