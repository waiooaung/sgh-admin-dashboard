"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeftRight,
  JapaneseYen,
  Banknote,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useAuth } from "@/context/authContext";

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
  const { user } = useAuth();
  const tenantId = user?.tenantId || 0;
  const { data, error } = useSWR<ApiResponse>(
    `/dashboard/transaction-statistics?tenantId=${tenantId}`,
    fetcher,
  );
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
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Total Transactions</p>
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
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Total USD</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Received from Agents</p>
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
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Total USD</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Paid to Suppliers</p>
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
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total USD Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Profit + Commission</p>
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              ${new Intl.NumberFormat("en-US").format(totalEarningsUSD)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Total RMB</CardTitle>
            <JapaneseYen className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Total Exchanged RMB</p>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              ¥{new Intl.NumberFormat("en-US").format(totalAmountRMB)}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardTransactionOverview;
