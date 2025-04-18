import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Currency } from "@/types/currency";
import { useAgentBalances } from "@/hooks/useAgentBalances";

interface Data {
  totalTransactionsCount: number;
  totalBaseAmount: number;
  totalQuoteAmountSell: number;
  totalAmountReceivedFromAgent: number;
  totalRemainingAmountFromAgent: number;
  baseCurrency: Currency;
  quoteCurrency: Currency;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data[];
}
const AgentOverview = ({
  tenantId,
  agentId,
}: {
  tenantId: number;
  agentId: number;
}) => {
  const { data } = useSWR<ApiResponse>(
    `/transactions/statistics?tenantId=${tenantId}&agentId=${agentId}`,
    fetcher,
  );

  const statistics = data?.data || [];

  const { agentBalances } = useAgentBalances(agentId);
  const updatedStatistics = statistics.map((stats) => {
    const match = agentBalances.find(
      (r) => r.currencyId === stats.quoteCurrency.id,
    );

    return {
      ...stats,
      totalAmountReceivedFromAgent: match ? match.receivedAmount : 0,
    };
  });
  return updatedStatistics.map((stats, index) => {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-3"
        key={index}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              {stats.baseCurrency.name} - {stats.quoteCurrency.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/transactions?date=25-02-2025">
              <div className="text-base font-bold text-green-500 truncate">
                {stats.totalTransactionsCount}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              Total Exchanged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/transactions?date=25-02-2025">
              <div className="text-base font-bold text-green-500 truncate">
                {stats.baseCurrency.symbol}
                {new Intl.NumberFormat("en-US").format(stats.totalBaseAmount)}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              Total Exchanged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <div className="text-base font-bold text-blue-500 truncate">
                {stats.quoteCurrency.symbol}
                {new Intl.NumberFormat("en-US").format(
                  stats.totalQuoteAmountSell,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              Amount Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <div className="text-base font-bold text-amber-500 truncate">
                {stats.quoteCurrency.symbol}
                {new Intl.NumberFormat("en-US").format(
                  stats.totalAmountReceivedFromAgent,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              Balance Owed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <div className="text-base font-bold text-red-500 truncate">
                {stats.quoteCurrency.symbol}
                {new Intl.NumberFormat("en-US").format(
                  stats.totalRemainingAmountFromAgent,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              Credit Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <div className="text-base font-bold text-red-500 truncate">
                {stats.quoteCurrency.symbol}
                {new Intl.NumberFormat("en-US").format(
                  stats.totalAmountReceivedFromAgent -
                    stats.totalRemainingAmountFromAgent,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  });
};

export default AgentOverview;
