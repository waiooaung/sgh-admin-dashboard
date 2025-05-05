"use client";
import useSWR from "swr";
import { useState } from "react";
import fetcher from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { View, Trash } from "lucide-react";
import { PaginationControls } from "./pagination-controls";
import { AgentPayment } from "@/types/agentPayment";
import { MetaData } from "@/types/meta-data";
import AgentPaymentSkeletonTable from "./agent-payment-skeleton-table";
import useDeleteAgentPayment from "@/hooks/useDeleteAgentPayment";
import { toast } from "sonner";
import useDataContext from "@/hooks/useDataContext";
import { useAuth } from "@/context/authContext";
import { ConfirmDialog } from "../dialogs/ConfirmDialog";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: AgentPayment[];
  meta: MetaData;
}

interface AgentPaymentTableProps {
  paymentDate?: Date;
  status?: string;
  agentId?: number;
  from?: Date;
  to?: Date;
}

const AgentPaymentTable = ({ agentId, from, to }: AgentPaymentTableProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;
  const { setAgent, setAgentPayment } = useDataContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
  });

  const { trigger: deletePayment } = useDeleteAgentPayment();

  if (tenantId) queryParams.append("tenantId", tenantId.toString());
  if (from) {
    from.setHours(0, 0, 0, 0);
    queryParams.append("from", from.toISOString());
  }
  if (agentId) queryParams.append("agentId", agentId.toString());
  if (from) {
    from.setHours(0, 0, 0, 0);
    queryParams.append("from", from.toISOString());
  }
  if (to) {
    to.setHours(23, 59, 59, 999);
    queryParams.append("to", to.toISOString());
  }

  const { data, error, mutate, isLoading } = useSWR<ApiResponse>(
    `/agent-payments?${queryParams.toString()}`,
    fetcher,
  );

  if (error)
    return <p className="text-red-500">Failed to load transactions.</p>;

  const agentPayments = data?.data || [];
  const meta = data?.meta || { totalItems: 0, totalPages: 0, currentPage: 1 };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    mutate();
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePayment(id);
      toast.success("Data deleted successfully!");
      mutate();
    } catch {
      toast.error(`Failed to delete transaction.`);
    }
  };

  return (
    <div>
      <Table className="table-auto w-full text-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Agent</TableHead>
            <TableHead className="text-left">Amount Paid</TableHead>
            <TableHead className="text-left">Payment Type</TableHead>
            <TableHead className="text-left">Payment Date</TableHead>
            <TableHead className="text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <AgentPaymentSkeletonTable />
        ) : (
          <TableBody>
            {agentPayments.length > 0 &&
              agentPayments.map((data) => (
                <TableRow
                  key={data.id}
                  className="hover:bg-blend-color transition-colors"
                >
                  <TableCell>
                    <a
                      className="cursor-pointer"
                      onClick={() => {
                        setAgent(data.Agent);
                        router.push(`/dashboard/agents/detail`);
                      }}
                    >
                      {data.Agent.name}
                    </a>
                  </TableCell>
                  <TableCell className="text-left">
                    {data.Currency.symbol}
                    {data.amountPaid.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-left">
                    {data.paymentType}
                  </TableCell>
                  <TableCell className="text-left">
                    {new Date(data.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center space-x-0">
                      <Button
                        size={null}
                        variant="ghost"
                        className="w-5 h-5 p-0 min-w-0 cursor-pointer"
                        onClick={() => {
                          setAgentPayment(data);
                          router.push(
                            `/dashboard/payments/agent-payments/detail`,
                          );
                        }}
                      >
                        <View className="w-3 h-3" />
                      </Button>

                      <ConfirmDialog
                        trigger={
                          <Button
                            size={null}
                            variant="ghost"
                            className="w-5 h-5 p-0 min-w-0 cursor-pointer text-red-600"
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        }
                        title="Delete Payment"
                        description="Are you sure you want to delete this payment?"
                        confirmText="Delete"
                        onConfirm={() => handleDelete(data.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm">
          Total Payments:{" "}
          <span className="font-semibold">{meta.totalItems}</span>
        </p>

        <PaginationControls
          currentPage={currentPage}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AgentPaymentTable;
