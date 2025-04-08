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
import { SupplierPayment } from "@/types/supplierPayment";
import { MetaData } from "@/types/meta-data";
import SupplierPaymentSkeletonTable from "./supplier-payment-skeleton-table";
import useDeleteSupplierPayment from "@/hooks/useDeleteSupplierPayment";
import { toast } from "sonner";
import useDataContext from "@/hooks/useDataContext";
import { useAuth } from "@/context/authContext";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: SupplierPayment[];
  meta: MetaData;
}

interface SupplierPaymentTableProps {
  paymentDate?: Date;
  status?: string;
  supplierId?: number;
  from?: Date;
  to?: Date;
}

const SupplierPaymentTable = ({
  supplierId,
  from,
  to,
}: SupplierPaymentTableProps) => {
  const router = useRouter();
  const { setSupplier, setSupplierPayment } = useDataContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;

  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
  });

  const { trigger: deletePayment } = useDeleteSupplierPayment();

  if (tenantId) queryParams.append("tenantId", tenantId.toString());
  if (supplierId) queryParams.append("supplierId", supplierId.toString());
  if (from) {
    from.setHours(0, 0, 0, 0);
    queryParams.append("from", from.toISOString());
  }
  if (to) {
    to.setHours(23, 59, 59, 999);
    queryParams.append("to", to.toISOString());
  }

  const { data, error, mutate, isLoading } = useSWR<ApiResponse>(
    `/supplier-payments?${queryParams.toString()}`,
    fetcher,
  );

  if (error)
    return <p className="text-red-500">Failed to load transactions.</p>;

  const supplierPayments = data?.data || [];
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
      <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <TableHeader className="text-sm font-semibold">
          <TableRow>
            <TableHead className="text-left truncate">Supplier</TableHead>
            <TableHead className="text-left truncate">
              Amount Paid (USD)
            </TableHead>
            <TableHead className="text-left truncate">Payment Type</TableHead>
            <TableHead className="text-left truncate">Payment Date</TableHead>
            <TableHead className="text-left truncate">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <SupplierPaymentSkeletonTable />
        ) : (
          <TableBody>
            {supplierPayments.length > 0 &&
              supplierPayments.map((data) => (
                <TableRow
                  key={data.id}
                  className="hover:bg-blend-color transition-colors"
                >
                  <TableCell className="w-15 truncate">
                    <a
                      className="cursor-pointer"
                      onClick={() => {
                        setSupplier(data.Supplier);
                        router.push(`/dashboard/suppliers/detail`);
                      }}
                    >
                      {data.Supplier.name}
                    </a>
                  </TableCell>
                  <TableCell className="truncate">
                    {data.Currency.symbol}
                    {data.amountPaid.toFixed(2)}
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
                            setSupplierPayment(data);
                            router.push("/dashboard/supplier-payments/detail");
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
      {/* {selectedSupplierPayment && (
        <EditSupplierPayment
          open={open}
          onClose={() => setOpen(false)}
          supplierPayment={selectedSupplierPayment}
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

export default SupplierPaymentTable;
