"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Download } from "lucide-react";
import Link from "next/link";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

interface Data {
  totalAgentCount: number;
  receivedAmountUSD: number;
  amountToReceiveUSD: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
}

const DashboardAgentOverview = () => {
  const { data, error } = useSWR<ApiResponse>("/dashboard/transaction-statistics", fetcher);
  const { totalAgentCount = 0, amountToReceiveUSD = 0 } = data?.data || {};

  useEffect(() => {
    if (error) {
      toast.error("Failed to load transaction statistics");
    }
  }, [error]);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">Agents</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/agents">
            <div className="text-xl font-bold text-blue-600 truncate">
              {new Intl.NumberFormat("en-US").format(totalAgentCount)}
            </div>
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Amount to Receive (USD)
          </CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/agents">
            <div className="text-xl font-bold text-blue-600 truncate">
              {new Intl.NumberFormat("en-US").format(amountToReceiveUSD)}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardAgentOverview;
