"use client";

import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Supplier } from "@/types/supplier";
import { MetaData } from "@/types/meta-data";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  MoreHorizontal,
  Pencil,
  Trash,
  ArrowLeft,
  ArrowRight,
  View,
} from "lucide-react";

import { AddNewSupplier } from "@/components/dialogs/add-new-supplier";
import EditSupplier from "@/components/dialogs/edit-supplier";
import useDelete from "@/hooks/useDelete";
import useDataContext from "@/hooks/useDataContext";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Supplier[];
  meta: MetaData;
}

const SupplierContainer = () => {
  const router = useRouter();
  const { setSupplier } = useDataContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  const { data, mutate } = useSWR<ApiResponse>(
    `/suppliers?page=${currentPage}&limit=${itemsPerPage}`,
    fetcher,
  );

  const suppliers = data?.data || [];
  const meta = data?.meta || {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage,
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpen(true);
  };

  const handleUpdate = () => {
    setOpen(false);
    mutate();
  };

  const { trigger: deleteSupplier } = useDelete("suppliers");
  const handleDelete = async (id: number) => {
    try {
      await deleteSupplier(id);
      toast.success("Supplier deleted successfully!");
      mutate();
    } catch (deleteError) {
      toast.error(`Failed to delete supplier: ${JSON.stringify(deleteError)}`);
    }
  };

  const handleRedirect = (supplier: Supplier) => {
    setSupplier(supplier);
    router.push("suppliers/detail");
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Suppliers Management
        </p>
        <AddNewSupplier onSuccess={() => mutate()} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Suppliers ({meta.totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
              <TableHeader className="text-sm font-semibold">
                <TableRow>
                  <TableHead className="p-3 text-left">Name</TableHead>
                  <TableHead className="p-3 text-left">Email</TableHead>
                  <TableHead className="p-3 text-left">Phone</TableHead>
                  <TableHead className="p-3 text-left">CreatedAt</TableHead>
                  <TableHead className="p-3 text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow
                    key={supplier.id}
                    className="hover:bg-blend-color transition-colors"
                  >
                    <TableCell className="p-3">
                      <a
                        className="cursor-pointer"
                        onClick={() => {
                          handleRedirect(supplier);
                        }}
                      >
                        {supplier.name}
                      </a>
                    </TableCell>
                    <TableCell className="p-3">
                      {supplier.contactEmail}
                    </TableCell>
                    <TableCell className="p-3">
                      <a
                        href={`https://wa.me/${supplier.contactPhone}`}
                        target="_blank"
                      >
                        {supplier.contactPhone}
                      </a>
                    </TableCell>
                    <TableCell className="p-3">
                      {supplier.createdAt
                        ? new Date(supplier.createdAt).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              handleRedirect(supplier);
                            }}
                          >
                            <View className="w-4 h-4 mr-2" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(supplier)}
                          >
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(supplier.id)}
                          >
                            <Trash className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {selectedSupplier && (
              <EditSupplier
                open={open}
                onClose={() => setOpen(false)}
                supplier={selectedSupplier}
                onSave={handleUpdate}
              />
            )}

            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setCurrentPage(meta.currentPage - 1)}
                disabled={meta.currentPage === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-sm font-medium">
                Page {meta.currentPage} of {meta.totalPages}
              </span>

              <Button
                onClick={() => setCurrentPage(meta.currentPage + 1)}
                disabled={meta.currentPage >= meta.totalPages}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierContainer;
