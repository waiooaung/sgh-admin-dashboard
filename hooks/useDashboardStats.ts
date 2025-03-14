import useSWR from "swr";
import fetcher from "@/lib/fetcher";

interface ApiResponse {
  totalTransactions: number;
  totalEarningsUSD: number;
  totalProfitUSD: number;
  supplierCount: number;
  agentCount: number;
}
const useDashboardStats = () => {
  return useSWR<ApiResponse>("/dashboard/transaction-statistics", fetcher);
};

export default useDashboardStats;
