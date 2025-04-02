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
  totalProfitAmount: number;
  currency: Currency;
}
interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data[];
}

const DisplayProfitOverview = () => {
  const { user } = useAuth();
  const tenantId = user?.tenantId || undefined;
  const { data, error } = useSWR<ApiResponse>(
    `/dashboard/transaction-profit-statistics?tenantId=${tenantId}`,
    fetcher,
  );
  const profitStats = data?.data || [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load transaction profit statistics");
    }
  }, [error]);
  return profitStats.map((stats, index) => (
    <Card key={index}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Total Profit ({stats.currency.name})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Link href="/dashboard/transactions">
          <div className="font-bold text-green-500 truncate">
            {new Intl.NumberFormat("en-US").format(stats.totalProfitAmount)}
          </div>
        </Link>
      </CardContent>
    </Card>
  ));
};

export default DisplayProfitOverview;
