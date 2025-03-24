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
import { View, Pencil, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { PaginationControls } from "./pagination-controls";
import { Transaction } from "@/types/transaction";
import { MetaData } from "@/types/meta-data";
import TransactionSkeletonTable from "./transaction-skeleton-table";
import EditTransaction from "../dialogs/edit-transaction";
import useDeleteTransaction from "@/hooks/useDeleteTransaction";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Transaction[];
  meta: MetaData;
}

interface TransactionTableProps {
  supplierId?: number;
  agentId?: number;
  from?: Date;
  to?: Date;
}

const TransactionTable = ({
  supplierId,
  agentId,
  from,
  to,
}: TransactionTableProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : 0;

  const [open, setOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const queryParams = new URLSearchParams({
    tenantId: tenantId.toString(),
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
  });

  const { trigger: deleteTransaction } = useDeleteTransaction();

  if (supplierId) queryParams.append("supplierId", supplierId.toString());
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
    `/transactions?${queryParams.toString()}`,
    fetcher,
  );

  if (error)
    return <p className="text-red-500">Failed to load transactions.</p>;

  const transactions = data?.data || [];
  const meta = data?.meta || { totalItems: 0, totalPages: 0, currentPage: 1 };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    mutate();
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleUpdate = () => {
    setOpen(false);
    mutate();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully!");
      mutate();
    } catch {
      toast.error(`Failed to delete Transaction.`);
    }
  };

  return (
    <div>
      <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <TableHeader className="text-sm font-semibold">
          <TableRow>
            <TableHead className="text-left truncate">Date</TableHead>
            <TableHead className="text-left truncate">Amount (RMB)</TableHead>
            <TableHead className="text-left truncate">
              Amount USD <span className="text-blue-500">(Buy Rate)</span>
            </TableHead>
            <TableHead className="text-left truncate">
              Amount USD <span className="text-green-500">(Sell Rate)</span>
            </TableHead>
            <TableHead className="text-left truncate">Profit (USD)</TableHead>
            <TableHead className="text-left truncate">
              Commission (USD)
            </TableHead>
            <TableHead className="text-left truncate">
              Total Earnings (USD)
            </TableHead>
            <TableHead className="text-left truncate">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TransactionSkeletonTable />
        ) : (
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="hover:bg-blend-color transition-colors"
              >
                <TableCell className="w-15 truncate">
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="truncate">
                  &#165; {transaction.amountRMB.toLocaleString()}
                </TableCell>
                <TableCell className="truncate">
                  ${transaction.amountUSDBuy.toFixed(2)}
                  <span>({transaction.buyRate})</span>
                </TableCell>
                <TableCell className="truncate">
                  ${transaction.amountUSDSell.toFixed(2)}
                  <span>({transaction.sellRate})</span>
                </TableCell>
                <TableCell className="truncate">
                  ${transaction.profitUSD.toFixed(2)}
                </TableCell>
                <TableCell className="truncate">
                  ${transaction.commissionUSD.toFixed(2)}
                </TableCell>
                <TableCell className="truncate">
                  ${transaction.totalEarningsUSD.toFixed(2)}
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
                          router.push(
                            `/dashboard/transactions/${transaction.id}`,
                          );
                        }}
                      >
                        <View className="w-4 h-4 mr-2" /> Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(transaction.id)}
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
      {selectedTransaction && (
        <EditTransaction
          open={open}
          onClose={() => setOpen(false)}
          transaction={selectedTransaction}
          onSave={handleUpdate}
        />
      )}

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm">
          Total Transactions:{" "}
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

export default TransactionTable;
