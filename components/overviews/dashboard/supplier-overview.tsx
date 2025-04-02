"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Handshake } from "lucide-react";
import Link from "next/link";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useAuth } from "@/context/authContext";

interface Data {
  suppliersCount: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
}

const DashboardSupplierOverview = () => {
  const { user } = useAuth();
  const tenantId = user?.tenantId || null;
  const { data, error } = useSWR<ApiResponse>(
    `/dashboard/supplier-statistics?tenantId=${tenantId}`,
    fetcher,
  );
  const { suppliersCount = 0 } = data?.data || {};

  useEffect(() => {
    if (error) {
      toast.error("Failed to load supplier statistics");
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
              {new Intl.NumberFormat("en-US").format(suppliersCount)}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardSupplierOverview;
