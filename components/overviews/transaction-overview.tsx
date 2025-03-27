"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeftRight,
  JapaneseYen,
  DollarSign,
  Banknote,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useAuth } from "@/context/authContext";

interface Data {
  totalTransactionsCount: number;
  totalBaseAmount: number;
  totalQuoteAmountBuy: number;
  totalQuoteAmountSell: number;
  totalCommission: number;
  totalEarnings: number;
  totalProfit: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
}

const TransactionOverview = () => {
  const { user } = useAuth();
  const tenantId = user?.tenantId || null;
  const { data, error } = useSWR<ApiResponse>(
    "/dashboard/transaction-statistics?tenantId=" + tenantId,
    fetcher,
  );
  const {
    totalTransactionsCount = 0,
    totalBaseAmount = 0,
    totalQuoteAmountBuy = 0,
    totalQuoteAmountSell = 0,
    totalEarnings = 0,
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
            <CardTitle className="text-sm font-medium truncate">
              Transactions
            </CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Total Transactions
          </p>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              {totalTransactionsCount}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium truncate">
              Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Received from Agents
          </p>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              {totalQuoteAmountSell.toFixed(2)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium truncate">
              Total
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Paid to Suppliers
          </p>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              {totalQuoteAmountBuy.toFixed(2)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium truncate">
              Total Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Profit + Commission
          </p>
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              {totalEarnings}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium truncate">
              Total
            </CardTitle>
            <JapaneseYen className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Total Exchanged RMB
          </p>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/transactions">
            <div className="text-xl font-bold text-green-500 truncate">
              {totalBaseAmount}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default TransactionOverview;
