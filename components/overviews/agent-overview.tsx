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
  totalBaseAmount: number;
  totalQuoteAmountSell: number;
  totalAmountReceivedFromAgent: number;
  totalRemainingAmountFromAgent: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
}
const AgentOverview = ({
  tenantId,
  agentId,
}: {
  tenantId: number;
  agentId: number;
}) => {
  const { data, error } = useSWR<ApiResponse>(
    `/transactions/statistics?tenantId=${tenantId}&agentId=${agentId}`,
    fetcher,
  );

  const {
    totalBaseAmount = 0,
    totalQuoteAmountSell = 0,
    totalAmountReceivedFromAgent = 0,
    totalRemainingAmountFromAgent = 0,
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
            Total Exchanged (From)
          </CardTitle>
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions?date=25-02-2025">
            <div className="text-2xl font-bold text-green-500 truncate">
              {new Intl.NumberFormat("en-US").format(totalBaseAmount)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Total Exchanged (To)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-blue-500 truncate">
              {new Intl.NumberFormat("en-US").format(totalQuoteAmountSell)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Received Amount
          </CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-amber-500 truncate">
              {new Intl.NumberFormat("en-US").format(
                totalAmountReceivedFromAgent,
              )}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Amount to Receive
          </CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-red-500 truncate">
              {new Intl.NumberFormat("en-US").format(
                totalRemainingAmountFromAgent,
              )}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default AgentOverview;
