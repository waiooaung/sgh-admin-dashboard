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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { View, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { PaginationControls } from "./pagination-controls";
import { AgentPayment } from "@/types/agentPayment";
import { MetaData } from "@/types/meta-data";
import AgentPaymentSkeletonTable from "./agent-payment-skeleton-table";
import useDeleteTransaction from "@/hooks/useDeleteTransaction";
import { toast } from "sonner";
import useDataContext from "@/hooks/useDataContext";

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

const AgentPaymentTable = ({
  agentId,
  from,
  to,
}: AgentPaymentTableProps) => {
  const router = useRouter();
  const { setAgent, setAgentPayment } = useDataContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // const [open, setOpen] = useState<boolean>(false);
  // const [selectedAgentPayment, setSelectedAgentPayment] =
  //   useState<AgentPayment | null>(null);

  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
  });

  const { trigger: deleteTransaction } = useDeleteTransaction();

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

  // const handleEdit = (agentPayment: AgentPayment) => {
  //   setSelectedAgentPayment(agentPayment);
  //   setOpen(true);
  // };

  // const handleUpdate = () => {
  //   setOpen(false);
  //   mutate();
  // };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      toast.success("Data deleted successfully!");
      mutate();
    } catch (deleteError) {
      toast.error(
        `Failed to delete transaction: ${JSON.stringify(deleteError)}`,
      );
    }
  };

  return (
    <div>
      <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <TableHeader className="text-sm font-semibold">
          <TableRow>
            <TableHead className="text-left truncate">Agent</TableHead>
            <TableHead className="text-left truncate">
              Amount Paid (USD)
            </TableHead>
            <TableHead className="text-left truncate">Payment Type</TableHead>
            <TableHead className="text-left truncate">Payment Date</TableHead>
            <TableHead className="text-left truncate">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <AgentPaymentSkeletonTable />
        ) : (
          <TableBody>
            {agentPayments.length > 0 && agentPayments.map((data) => (
              <TableRow
                key={data.id}
                className="hover:bg-blend-color transition-colors"
              >
                <TableCell className="w-15 truncate">
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
                <TableCell className="truncate">
                  $ {data.amountPaidUSD.toFixed(2)}
                </TableCell>
                <TableCell className="truncate">{data.paymentType}</TableCell>
                <TableCell className="truncate">
                  {new Date(data.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="truncate">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setAgentPayment(data);
                          router.push("/dashboard/agent-payments/detail");
                        }}
                      >
                        <View className="w-4 h-4 mr-2" /> Detail
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => handleEdit(data)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(data.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {/* {selectedAgentPayment && (
        <EditAgentPayment
          open={open}
          onClose={() => setOpen(false)}
          agentPayment={selectedAgentPayment}
          onSave={handleUpdate}
        />
      )} */}

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
