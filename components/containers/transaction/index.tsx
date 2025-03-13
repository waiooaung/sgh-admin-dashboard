"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import {
  ArrowLeftRight,
  JapaneseYen,
  DollarSign,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";
import { MetaData } from "@/types/meta-data";
import { Transaction } from "@/types/transaction";
import { AddNewTransaction } from "@/components/dialogs/add-new-transaction";
import TransactionTable from "@/components/tables/transaction-table";

interface Overview {
  totalTransactions: number;
  totalEarningsUSD: number;
  totalProfitUSD: number;
  totalAmountRMB: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Transaction[];
  meta: MetaData;
  overview: Overview;
}

const TransactionContainer = () => {
  const queryParams = new URLSearchParams({
    page: String(1),
    limit: String(10),
  });

  const { data, mutate } = useSWR<ApiResponse>(
    `/transactions?${queryParams}`,
    fetcher,
  );

  const overview = data?.overview || {
    totalTransactions: 0,
    totalEarningsUSD: 0,
    totalProfitUSD: 0,
    totalAmountRMB: 0,
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Transactions</p>
        <AddNewTransaction onSuccess={() => mutate()} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Transactions",
            value: overview.totalTransactions,
            icon: ArrowLeftRight,
          },
          {
            label: "Total Revenue",
            value: overview.totalEarningsUSD,
            icon: JapaneseYen,
          },
          {
            label: "Total Profit",
            value: overview.totalProfitUSD,
            icon: DollarSign,
          },
          {
            label: "Exchanged Amount (RMB)",
            value: overview.totalAmountRMB,
            icon: CircleDollarSign,
          },
        ].map((card, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium truncate">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/transactions">
                <div className="text-2xl font-bold text-blue-600 truncate">
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: card.value % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2,
                  }).format(card.value)}
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
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
