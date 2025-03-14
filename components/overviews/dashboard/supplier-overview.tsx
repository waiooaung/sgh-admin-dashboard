"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Handshake, Upload } from "lucide-react";
import Link from "next/link";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

interface Data {
  totalSupplierCount: number;
  paidAmountUSD: number;
  amountToPayUSD: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
}

const DashboardSupplierOverview = () => {
  const { data, error } = useSWR<ApiResponse>(
    "/dashboard/transaction-statistics",
    fetcher,
  );
  const { totalSupplierCount = 0, amountToPayUSD = 0 } = data?.data || {};

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
            Suppliers
          </CardTitle>
          <Handshake className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/suppliers">
            <div className="text-xl font-bold text-orange-500 truncate">
              {new Intl.NumberFormat("en-US").format(totalSupplierCount)}
            </div>
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Amount to Pay (USD)
          </CardTitle>
          <Upload className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/suppliers">
            <div className="text-xl font-bold text-orange-500 truncate">
              ${new Intl.NumberFormat("en-US").format(amountToPayUSD)}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardSupplierOverview;
