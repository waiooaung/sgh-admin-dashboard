"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Supplier } from "@/types/supplier";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { Pencil, Trash, View } from "lucide-react";

import EditSupplier from "@/components/dialogs/edit-supplier";
import useDelete from "@/hooks/useDelete";
import useDataContext from "@/hooks/useDataContext";
import { useAuth } from "@/context/authContext";
import { useSuppliers } from "@/hooks/useSuppliers";
import SupplierSkeletonTable from "./supplier-skeleton-table";
import { ConfirmDialog } from "../dialogs/ConfirmDialog";
import { PaginationControls } from "./pagination-controls";

const SupplierTable = () => {
  const router = useRouter();
  const { user } = useAuth();
  const tenantId = user?.tenantId || undefined;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { setSupplier } = useDataContext();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
  });
  if (tenantId) {
    queryParams.append("tenantId", tenantId.toString());
  }

  const { suppliers, meta, isLoading, mutate } = useSuppliers(queryParams);

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
    } catch {
      toast.error(`Failed to delete supplier.`);
    }
  };

  const handleRedirect = (supplier: Supplier) => {
    setSupplier(supplier);
    router.push("suppliers/detail");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Table className="table-auto w-full text-xs text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <SupplierSkeletonTable />
        ) : (
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow
                key={supplier.id}
                className="hover:bg-blend-color transition-colors"
              >
                <TableCell>
                  <a
                    className="cursor-pointer"
                    onClick={() => {
                      handleRedirect(supplier);
                    }}
                  >
                    {supplier.name}
                  </a>
                </TableCell>
                <TableCell>{supplier.contactEmail}</TableCell>
                <TableCell>
                  <a
                    href={`https://wa.me/${supplier.contactPhone}`}
                    target="_blank"
                  >
                    {supplier.contactPhone}
                  </a>
                </TableCell>
                <TableCell>
                  {supplier.createdAt
                    ? new Date(supplier.createdAt).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-0">
                    <Button
                      size={null}
                      variant="ghost"
                      className="w-5 h-5 p-0 min-w-0 cursor-pointer"
                      onClick={() => {
                        handleRedirect(supplier);
                      }}
                    >
                      <View className="w-3 h-3" />
                    </Button>

                    <Button
                      size={null}
                      variant="ghost"
                      className="w-5 h-5 p-0 min-w-0 cursor-pointer"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Pencil className="w-3 h-3" />
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
                      title="Delete Supplier"
                      description="Are you sure you want to delete this supplier?"
                      confirmText="Delete"
                      onConfirm={() => handleDelete(supplier.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {selectedSupplier && (
        <EditSupplier
          open={open}
          onClose={() => setOpen(false)}
          supplier={selectedSupplier}
          onSave={handleUpdate}
        />
      )}

      {meta && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm">
            Total : <span className="font-semibold">{meta.totalItems}</span>
          </p>

          <PaginationControls
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SupplierTable;
