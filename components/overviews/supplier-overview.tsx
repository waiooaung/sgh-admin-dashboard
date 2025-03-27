import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  JapaneseYenIcon,
  DollarSign,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { toast } from "sonner";

interface Data {
  totalTransactionsCount: number;
  totalBaseAmount: number;
  totalQuoteAmountBuy: number;
  totalAmountPaidToSupplier: number;
  totalRemainingAmountToPayToSupplier: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
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

  const {
    totalBaseAmount = 0,
    totalQuoteAmountBuy = 0,
    totalAmountPaidToSupplier = 0,
    totalRemainingAmountToPayToSupplier = 0,
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
            Total Exchanged ( From )
          </CardTitle>
          <JapaneseYenIcon className="h-4 w-4 text-muted-foreground" />
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
              {new Intl.NumberFormat("en-US").format(totalQuoteAmountBuy)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Paid Amount
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-amber-500 truncate">
              {new Intl.NumberFormat("en-US").format(totalAmountPaidToSupplier)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Amount to Pay
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-red-500 truncate">
              {new Intl.NumberFormat("en-US").format(
                totalRemainingAmountToPayToSupplier,
              )}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default SupplierOverview;
