import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
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
import { Pencil, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";

import { TransactionType } from "@/types/transactionType";
import TransactionSkeletonTable from "./transaction-skeleton-table";
import { useAuth } from "@/context/authContext";
import EditTransactionType from "../dialogs/edit-transaction-type";
import useDeleteTransactionType from "@/hooks/useDeleteTransactionType";
import { toast } from "sonner";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  data: TransactionType[];
}

const TransactionTypeTable = () => {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;

  const { data, error, mutate, isLoading } = useSWR<ApiResponse>(
    `/transaction-types?tenantId=${tenantId}`,
    fetcher,
  );

  const [open, setOpen] = useState<boolean>(false);
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<TransactionType | null>(null);

  const { trigger: deleteTransactionType } = useDeleteTransactionType();

  if (error)
    return <p className="text-red-500">Failed to load transaction types.</p>;

  const transactionTypes = data?.data || [];

  const handleEdit = (transactionType: TransactionType) => {
    setSelectedTransactionType(transactionType);
    setOpen(true);
  };

  const handleUpdate = () => {
    setOpen(false);
    mutate();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransactionType(id);
      toast.success("Transaction type deleted successfully!");
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
            <TableHead className="text-left truncate">Name</TableHead>
            <TableHead className="text-left truncate">CreatedAt</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TransactionSkeletonTable />
        ) : (
          <TableBody>
            {transactionTypes.map((data) => (
              <TableRow
                key={data.id}
                className="hover:bg-blend-color transition-colors"
              >
                <TableCell className="truncate">{data.name}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(data)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
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

      {selectedTransactionType && (
        <EditTransactionType
          open={open}
          onClose={() => setOpen(false)}
          transactionType={selectedTransactionType}
          onSave={handleUpdate}
        />
      )}

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm">
          Total Transaction Type:{" "}
          <span className="font-semibold">{transactionTypes.length}</span>
        </p>
      </div>
    </div>
  );
};

export default TransactionTypeTable;
