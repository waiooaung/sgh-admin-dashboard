"use client";

import useGetDetail from "@/hooks/useGetDetail";
import { TransactionDetail } from "@/types/transaction";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionDetailContainerProps {
  transactionId: string;
}

interface TransactionDetailAPIResponse {
  statusCode: number;
  success: boolean;
  data: TransactionDetail;
}

const TransactionDetailContainer = ({
  transactionId,
}: TransactionDetailContainerProps) => {
  const { data } = useGetDetail<TransactionDetailAPIResponse>(
    "/transactions",
    Number(transactionId),
  );
  if (!data?.data) return null;
  const transaction: TransactionDetail = data?.data;

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Transaction Detail
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="w-full mx-auto shadow-lg rounded-lg border py-0">
          <CardHeader className="border-b p-6 rounded-t-lg">
            <CardTitle className="text-2xl font-semibold">
              Transaction No.{" "}
              <span className="text-blue-500">#TNX-{transaction.id}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-sm">Transaction Date</p>
              <p className="font-medium">
                {new Date(transaction.transactionDate).toLocaleString()}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 border rounded-lg shadow-sm">
                <p className="text-sm">Amount</p>
                <p className="text-lg font-semibold">
                  ¥{transaction.baseAmount}
                </p>
              </div>
              <div className="p-4 border rounded-lg shadow-sm">
                <p className="text-sm">Profit (USD)</p>
                <p className="text-lg font-semibold text-green-600">
                  ${transaction.profit.toFixed(2)}
                </p>
              </div>
              <div className="p-4 border rounded-lg shadow-sm">
                <p className="text-sm">Commission Rate</p>
                <p className="text-lg font-semibold text-blue-600">
                  {(transaction.commissionRate * 100).toFixed(2)}%
                </p>
              </div>
              <div className="p-4 border rounded-lg shadow-sm">
                <p className="text-sm">Total Earnings (USD)</p>
                <p className="text-lg font-semibold text-purple-600">
                  ${transaction.totalEarnings.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Supplier & Agent Info */}
            <div className="p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">Supplier</h2>
              <p className="">{transaction.supplier.name}</p>
              <p className="">{transaction.supplier.contactEmail}</p>
            </div>
            <div className="p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">Agent</h2>
              <p className="">{transaction.agent.name}</p>
              <p className="">{transaction.agent.contactEmail}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetailContainer;
