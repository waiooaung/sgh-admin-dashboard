"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

type TransactionStats = {
  date: string;
  baseCurrency: string;
  quoteCurrency: string;
  profit: number;
  transaction: number;
  commission: number;
};

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: TransactionStats[];
}

export default function DashboardChart() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || null;
  const { data } = useSWR<ApiResponse>(
    `/dashboard/profit-statistics?tenantId=${tenantId}`,
    fetcher,
  );
  const chartData = data?.data ? data.data : [];

  const groupedByPair = chartData.reduce(
    (acc, item) => {
      const pair = `${item.baseCurrency}/${item.quoteCurrency}`;
      if (!acc[pair]) acc[pair] = [];
      acc[pair].push(item);
      return acc;
    },
    {} as Record<string, TransactionStats[]>,
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {Object.entries(groupedByPair).map(([pair, pairData]) => (
        <Card key={pair} className="shadow-md border">
          <CardHeader>
            <CardTitle className="text-lg">{pair}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pairData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#10b981" name="Profit" />
                <Bar dataKey="commission" fill="#3b82f6" name="Commission" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
