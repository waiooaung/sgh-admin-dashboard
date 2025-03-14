"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeftRight,
  JapaneseYen,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowUpRightFromCircle,
} from "lucide-react";
import Link from "next/link";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

interface Data {
  totalTransactionsCount: number;
  totalAmountRMB: number;
  totalAmountUSDBuy: number;
  totalAmountUSDSell: number;
  totalCommissionUSD: number;
  totalEarningsUSD: number;
  totalProfitUSD: number;
  supplierCount: number;
  agentCount: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
}

const DashboardTransactionOverview = () => {
  const { data, error } = useSWR<ApiResponse>("/dashboard/transaction-statistics", fetcher);
  const {
    totalTransactionsCount = 0,
    totalAmountRMB = 0,
    totalAmountUSDBuy = 0,
    totalAmountUSDSell = 0,
    totalEarningsUSD = 0,
  } = data?.data || {};

  useEffect(() => {
    if (error) {
      toast.error("Failed to load transaction statistics");
    }
  }, [error]);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Transactions
          </CardTitle>
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              {new Intl.NumberFormat("en-US").format(totalTransactionsCount)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Exchanged Amount (RMB)
          </CardTitle>
          <JapaneseYen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              ¥{new Intl.NumberFormat("en-US").format(totalAmountRMB)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Amount Sell (USD)
          </CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              ${new Intl.NumberFormat("en-US").format(totalAmountUSDSell)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Amount Buy (USD)
          </CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              ${new Intl.NumberFormat("en-US").format(totalAmountUSDBuy)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">Profit</CardTitle>
          <ArrowUpRightFromCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              ${new Intl.NumberFormat("en-US").format(totalEarningsUSD)}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardTransactionOverview;
