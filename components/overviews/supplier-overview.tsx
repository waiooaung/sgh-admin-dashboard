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
  totalAmountRMB: number;
  totalAmountUSD: number;
  totalPaidAmountUSD: number;
  totalAmountToPayUSD: number;
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
    `/supplier-transactions/statistics?supplierId=${supplierId}&tenantId=${tenantId}`,
    fetcher,
  );

  const {
    totalAmountRMB = 0,
    totalAmountUSD = 0,
    totalPaidAmountUSD = 0,
    totalAmountToPayUSD = 0,
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
          <JapaneseYenIcon className="h-4 w-4 text-muted-foreground" />
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
            Paid Amount (USD)
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-amber-500 truncate">
              $ {new Intl.NumberFormat("en-US").format(totalPaidAmountUSD)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Amount to Pay (USD)
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-red-500 truncate">
              $ {new Intl.NumberFormat("en-US").format(totalAmountToPayUSD)}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default SupplierOverview;
