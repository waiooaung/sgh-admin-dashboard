"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
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
import {
  ArrowLeftRight,
  CircleDollarSign,
  DollarSign,
  JapaneseYen,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ExchangeRateCard } from "@/components/cards/exchange-rate-card";

import { Transaction } from "@/types/transaction";

export default function Page() {
  const recentTransactions: Transaction[] = [
    {
      id: "001",
      date: "2023-10-01",
      amountRMB: 10000.5,
      amountUSD: 1449.28,
      handlingFee: 10.25,
      profit: 29.2,
      status: "paid",
      paymentType: "bank",
      paidAmount: 1449.28,
      dueAmount: 0,
    },
    {
      id: "002",
      date: "2023-10-02",
      amountRMB: 5000.75,
      amountUSD: 724.64,
      handlingFee: 5.15,
      profit: 14.6,
      status: "paid",
      paymentType: "bank",
      paidAmount: 1449.28,
      dueAmount: 0,
    },
    {
      id: "003",
      date: "2023-10-03",
      amountRMB: 12000.25,
      amountUSD: 1739.1,
      handlingFee: 12.5,
      profit: 34.9,
      status: "paid",
      paymentType: "bank",
      paidAmount: 1449.28,
      dueAmount: 0,
    },
    {
      id: "004",
      date: "2023-10-04",
      amountRMB: 8000.6,
      amountUSD: 1159.72,
      handlingFee: 8.75,
      profit: 22.75,
      status: "paid",
      paymentType: "bank",
      paidAmount: 1449.28,
      dueAmount: 0,
    },
    {
      id: "005",
      date: "2023-10-05",
      amountRMB: 15000.9,
      amountUSD: 2173.88,
      handlingFee: 15.4,
      profit: 44.3,
      status: "partially paid",
      paymentType: "cash",
      paidAmount: 362.32,
      dueAmount: 362.32,
    },
    {
      id: "006",
      date: "2023-10-06",
      amountRMB: 7500.3,
      amountUSD: 1086.93,
      handlingFee: 7.2,
      profit: 19.8,
      status: "partially paid",
      paymentType: "cash",
      paidAmount: 362.32,
      dueAmount: 362.32,
    },
    {
      id: "007",
      date: "2023-10-07",
      amountRMB: 9500.45,
      amountUSD: 1375.52,
      handlingFee: 9.1,
      profit: 25.55,
      status: "partially paid",
      paymentType: "cash",
      paidAmount: 362.32,
      dueAmount: 362.32,
    },
    {
      id: "008",
      date: "2023-10-08",
      amountRMB: 11000.8,
      amountUSD: 1592.18,
      handlingFee: 11.25,
      profit: 30.9,
      status: "partially paid",
      paymentType: "cash",
      paidAmount: 362.32,
      dueAmount: 362.32,
    },
    {
      id: "009",
      date: "2023-10-09",
      amountRMB: 13000.95,
      amountUSD: 1879.47,
      handlingFee: 13.6,
      profit: 37.25,
      status: "pending",
      paymentType: "bank",
      paidAmount: 0,
      dueAmount: 1739.1,
    },
    {
      id: "010",
      date: "2023-10-10",
      amountRMB: 14000.2,
      amountUSD: 2021.35,
      handlingFee: 14.8,
      profit: 39.85,
      status: "pending",
      paymentType: "bank",
      paidAmount: 0,
      dueAmount: 1739.1,
    },
  ];

  const totalTransactions = 500;
  const totalRevenue = 15000.5;
  const totalProfit = 32000.75;
  const totalAmountExchanged = 2500000.25;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium truncate">
              Total Transactions
            </CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/transactions?date=25-02-2025">
              <div className="text-2xl font-bold text-blue-600 truncate">
                {totalTransactions}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium truncate">
              Total Revenue
            </CardTitle>
            <JapaneseYen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <div className="text-2xl font-bold text-blue-600 truncate">
                {new Intl.NumberFormat("en-US").format(totalRevenue)}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium truncate">
              Total Profit
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <div className="text-2xl font-bold text-blue-600 truncate">
                ${new Intl.NumberFormat("en-US").format(totalProfit)}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium truncate">
              Total Amount Exchanged
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/transactions?status=partially_paid">
              <div className="text-2xl font-bold text-red-600 truncate">
                ${new Intl.NumberFormat("en-US").format(totalAmountExchanged)}
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ExchangeRateCard />
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount (RMB)</TableHead>
                  <TableHead>Amount (USD)</TableHead>
                  <TableHead>Handling Fee</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Due Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.id}</TableCell>
                    <TableCell>{txn.date}</TableCell>
                    <TableCell>{txn.amountRMB}</TableCell>
                    <TableCell>{txn.amountUSD}</TableCell>
                    <TableCell>{txn.handlingFee} AED</TableCell>
                    <TableCell>{txn.profit} AED</TableCell>
                    <TableCell>{txn.status}</TableCell>
                    <TableCell>{txn.paymentType}</TableCell>
                    <TableCell>{txn.paidAmount}</TableCell>
                    <TableCell>{txn.dueAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
