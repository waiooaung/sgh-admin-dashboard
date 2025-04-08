import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { toast } from "sonner";
import { Currency } from "@/types/currency";

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
const SupplierOverview = ({
  tenantId,
  supplierId,
}: {
  tenantId: number;
  supplierId: number;
}) => {
  const { data, error } = useSWR<ApiResponse>(
    `/transactions/statistics?supplierId=${supplierId}&tenantId=${tenantId}`,
    fetcher,
  );

  const statistics = data?.data || [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load transaction statistics");
    }
  }, [error]);
  return statistics.map((stats, index) => {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
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
                  stats.totalQuoteAmountBuy,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              Paid Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <div className="text-base font-bold text-amber-500 truncate">
                {stats.quoteCurrency.symbol}
                {new Intl.NumberFormat("en-US").format(
                  stats.totalAmountPaidToSupplier,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              Amount to Pay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <div className="text-base font-bold text-red-500 truncate">
                {stats.quoteCurrency.symbol}
                {new Intl.NumberFormat("en-US").format(
                  stats.totalRemainingAmountToPayToSupplier,
                )}
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  });
};

export default SupplierOverview;
