"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Download } from "lucide-react";
import Link from "next/link";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useAuth } from "@/context/authContext";

interface Data {
  agentsCount: number;
  totalAmountRemaining: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
}

const DashboardAgentOverview = () => {
  const { user } = useAuth();
  const tenantId = user?.tenantId || null;
  const { data, error } = useSWR<ApiResponse>(
    `/dashboard/agent-statistics?tenantId=${tenantId}`,
    fetcher,
  );
  const { agentsCount = 0, totalAmountRemaining = 0 } = data?.data || {};

  useEffect(() => {
    if (error) {
      toast.error("Failed to load agent statistics");
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
              {new Intl.NumberFormat("en-US").format(agentsCount)}
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
              ${new Intl.NumberFormat("en-US").format(totalAmountRemaining)}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardAgentOverview;
