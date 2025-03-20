import { useEffect } from "react";
import CustomBarChart from "./custom-bar-chart";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { toast } from "sonner";

interface Data {
  date: string;
  profit: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data[];
}

export default function DashboardChart() {
  const { data, error } = useSWR<ApiResponse>(
    "/dashboard/profit-statistics",
    fetcher,
  );
  const chartData = data?.data || [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load statistics");
    }
  }, [error]);
  return (
    <CustomBarChart
      data={chartData}
      xAxisKey="date"
      bars={[
        { key: "transaction", color: "#82ca9d" },
        { key: "profit", color: "#8884d8" },
        { key: "commission", color: "#ffc658" },
      ]}
      title="Monthly Transactions Overview"
      showTooltip={true}
    />
  );
}
