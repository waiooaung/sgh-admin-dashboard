import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Currency } from "@/types/currency";
import { useSupplierBalances } from "@/hooks/useSupplierBalances";

interface Data {
  totalTransactionsCount: number;
  totalBaseAmount: number;
  totalQuoteAmountBuy: number;
  totalAmountPaidToSupplier: number;
  totalRemainingAmountToPayToSupplier: number;
  baseCurrency: Currency;
  quoteCurrency: Currency;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data[];
}

const SupplierOwedOverview = ({
  tenantId,
  supplierId,
}: {
  tenantId: number;
  supplierId: number;
}) => {
  const { data } = useSWR<ApiResponse>(
    `/transactions/statistics?supplierId=${supplierId}&tenantId=${tenantId}`,
    fetcher,
  );

  const statistics = data?.data || [];
  const { supplierBalances } = useSupplierBalances(supplierId);

  const updatedStatistics = statistics.map((stats) => {
    const match = supplierBalances.find(
      (r) => r.currencyId === stats.quoteCurrency.id,
    );
    return {
      ...stats,
      supplierBalance: match ? match.paidAmount : 0,
    };
  });

  const grouped = updatedStatistics.reduce(
    (acc, stat) => {
      const symbol = stat.quoteCurrency.symbol;
      if (!acc[symbol]) {
        acc[symbol] = {
          quoteCurrencyId: stat.quoteCurrency.id,
          totalOwed: 0,
        };
      }
      acc[symbol].totalOwed += stat.totalRemainingAmountToPayToSupplier;
      return acc;
    },
    {} as Record<string, { quoteCurrencyId: number; totalOwed: number }>,
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max">
        {Object.entries(grouped).length === 0 ? (
          <Card className="min-w-[200px]">
            <CardContent className="text-sm text-gray-500 py-4">
              No amounts owed to suppliers
            </CardContent>
          </Card>
        ) : (
          Object.entries(grouped).map(
            ([symbol, { totalOwed, quoteCurrencyId }]) => (
              <Link
                key={symbol}
                href={`/dashboard/transactions?supplierId=${supplierId}&quoteCurrencyId=${quoteCurrencyId}`}
                className="min-w-[200px]"
              >
                <Card className="bg-white transition shadow rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 truncate">
                      {symbol} Amount Owed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-red-600">
                      {symbol}
                      {new Intl.NumberFormat("en-US").format(totalOwed)}
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

export default SupplierOwedOverview;
