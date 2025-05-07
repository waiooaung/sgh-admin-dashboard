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

const AgentDueOverview = ({
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
      agentBalance: match ? match.receivedAmount : 0,
    };
  });

  const grouped = updatedStatistics.reduce(
    (acc, stat) => {
      const symbol = stat.quoteCurrency.symbol;
      if (!acc[symbol]) {
        acc[symbol] = {
          quoteCurrencyId: stat.quoteCurrency.id,
          totalDue: 0,
        };
      }
      acc[symbol].totalDue += stat.totalRemainingAmountFromAgent;
      return acc;
    },
    {} as Record<string, { quoteCurrencyId: number; totalDue: number }>,
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max">
        {Object.entries(grouped).length === 0 ? (
          <Card className="min-w-[200px]">
            <CardContent className="text-sm text-gray-500 py-4">
              No dues available
            </CardContent>
          </Card>
        ) : (
          Object.entries(grouped).map(
            ([symbol, { totalDue, quoteCurrencyId }]) => (
              <Link
                key={symbol}
                href={`/dashboard/transactions?quoteCurrencyId=${quoteCurrencyId}&agentId=${agentId}`}
                className="min-w-[200px]"
              >
                <Card className="bg-white transition shadow rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 truncate">
                      Amount Due {symbol}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-red-600">
                      {symbol}
                      {new Intl.NumberFormat("en-US").format(totalDue)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ),
          )
        )}
      </div>
    </div>
  );
};

export default AgentDueOverview;
