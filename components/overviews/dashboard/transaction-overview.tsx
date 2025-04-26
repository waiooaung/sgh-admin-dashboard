"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useAuth } from "@/context/authContext";
import { Currency } from "@/types/currency";

interface Data {
  totalTransactionsCount: number;
  totalBaseAmount: number;
  totalQuoteAmountBuy: number;
  totalQuoteAmountSell: number;
  totalCommission: number;
  totalEarnings: number;
  totalProfit: number;
  totalRemainingAmountFromAgent: number;
  totalRemainingAmountToPayToSupplier: number;
  baseCurrency: Currency;
  quoteCurrency: Currency;
}
interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data[];
}

const DashboardTransactionOverview = () => {
  const { user } = useAuth();
  const tenantId = user?.tenantId || undefined;
  const { data, error } = useSWR<ApiResponse>(
    `/dashboard/transaction-statistics?tenantId=${tenantId}`,
    fetcher,
  );
  const transactionStats = data?.data || [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load transaction statistics");
    }
  }, [error]);
  return transactionStats.map((stats, index) => {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        key={index}
      >
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {stats.baseCurrency.name} - {stats.quoteCurrency.name}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
          </CardHeader>
          <CardContent>
            <Link
              href={`/dashboard/transactions?baseCurrencyId=${stats.baseCurrency.id}&quoteCurrencyId=${stats.quoteCurrency.id}`}
            >
              <div className="font-bold text-green-500 truncate">
                {new Intl.NumberFormat("en-US").format(
                  stats.totalTransactionsCount,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total Profit ({stats.quoteCurrency.symbol})
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Profit + Commission</p>
          </CardHeader>
          <CardContent>
            <Link
              href={`/dashboard/transactions?baseCurrencyId=${stats.baseCurrency.id}&quoteCurrencyId=${stats.quoteCurrency.id}`}
            >
              <div className="text-xl font-bold text-green-500 truncate">
                {new Intl.NumberFormat("en-US").format(stats.totalEarnings)}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total ({stats.baseCurrency.symbol})
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Total Exchanged</p>
          </CardHeader>
          <CardContent>
            <Link
              href={`/dashboard/transactions?baseCurrencyId=${stats.baseCurrency.id}&quoteCurrencyId=${stats.quoteCurrency.id}`}
            >
              <div className="text-xl font-bold text-green-500 truncate">
                {new Intl.NumberFormat("en-US").format(stats.totalBaseAmount)}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total ({stats.quoteCurrency.symbol})
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Received from Agents
            </p>
          </CardHeader>
          <CardContent>
            <Link
              href={`/dashboard/transactions?baseCurrencyId=${stats.baseCurrency.id}&quoteCurrencyId=${stats.quoteCurrency.id}`}
            >
              <div className="text-xl font-bold text-green-500 truncate">
                {new Intl.NumberFormat("en-US").format(
                  stats.totalQuoteAmountSell,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total ({stats.quoteCurrency.symbol})
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Paid to Suppliers</p>
          </CardHeader>
          <CardContent>
            <Link
              href={`/dashboard/transactions?baseCurrencyId=${stats.baseCurrency.id}&quoteCurrencyId=${stats.quoteCurrency.id}`}
            >
              <div className="text-xl font-bold text-green-500 truncate">
                {new Intl.NumberFormat("en-US").format(
                  stats.totalQuoteAmountBuy,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  });
};

export default DashboardTransactionOverview;
