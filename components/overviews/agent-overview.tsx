import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  ArrowLeftRight,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { toast } from "sonner";

interface Data {
  totalTransactionsCount: number;
  totalAmountRMB: number;
  totalAmountUSD: number;
  totalReceivedAmountUSD: number;
  totalAmountRemainingUSD: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
}
const AgentOverview = ({ agentId } : { agentId: number }) => {
  const { data, error } = useSWR<ApiResponse>(
    `/agent-transactions/statistics?agentId=${agentId}`,
    fetcher
  );

    const {
      totalAmountRMB = 0,
      totalAmountUSD = 0,
      totalReceivedAmountUSD = 0,
      totalAmountRemainingUSD = 0,
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
            Total Exchanged (RMB)
          </CardTitle>
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions?date=25-02-2025">
            <div className="text-2xl font-bold text-green-500 truncate">
              ¥ {new Intl.NumberFormat("en-US").format(totalAmountRMB)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Total Exchanged (USD)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-blue-500 truncate">
              $ {new Intl.NumberFormat("en-US").format(totalAmountUSD)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Received Amount (USD)
          </CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-amber-500 truncate">
              $ {new Intl.NumberFormat("en-US").format(totalReceivedAmountUSD)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Amount to Receive (USD)
          </CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-red-500 truncate">
              $ {new Intl.NumberFormat("en-US").format(totalAmountRemainingUSD)}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default AgentOverview;
