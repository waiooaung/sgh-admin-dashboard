import { useState } from "react";
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
import { Trash, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";

import { useAuth } from "@/context/authContext";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import ExchangeRateSkeleton from "./exchange-rate-skeleton";
import { PaginationControls } from "./pagination-controls";
import useDelete from "@/hooks/useDelete";
import { toast } from "sonner";
import { mutate } from "swr";

const ExchangeRateTable = () => {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;
  const [currentPage, setCurrentPage] = useState(1);

  const { exchangeRates, meta, isLoading } = useExchangeRates(tenantId);

  const { trigger: deleteData } = useDelete("exchange-rates");
  const handleDelete = async (id: number) => {
    try {
      await deleteData(id);
      toast.success("Data deleted successfully!");
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/exchange-rates"),
        undefined,
        { revalidate: true },
      );
    } catch {
      toast.error(`Failed to delete data`);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <TableHeader className="text-sm font-semibold">
          <TableRow>
            <TableHead className="text-left truncate">Name</TableHead>
            <TableHead className="text-left truncate">Exchange</TableHead>
            <TableHead className="text-left truncate">Buy Rate</TableHead>
            <TableHead className="text-left truncate">Sell Rate</TableHead>
            <TableHead className="text-left truncate">CreatedAt</TableHead>
            <TableHead className="text-left truncate">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <ExchangeRateSkeleton />
        ) : (
          <TableBody>
            {exchangeRates.map((data) => (
              <TableRow
                key={data.id}
                className="hover:bg-blend-color transition-colors"
              >
                <TableCell className="truncate">{data.name}</TableCell>
                <TableCell className="truncate">
                  {data.baseCurrency.name} - {data.quoteCurrency.name}
                </TableCell>
                <TableCell className="truncate">{data.buyRate}</TableCell>
                <TableCell className="truncate">{data.sellRate}</TableCell>
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

export default ExchangeRateTable;
