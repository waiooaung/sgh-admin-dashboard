import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash, CalendarIcon, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAuth } from "@/context/authContext";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import ExchangeRateSkeleton from "./exchange-rate-skeleton";
import { PaginationControls } from "./pagination-controls";
import useDelete from "@/hooks/useDelete";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "../dialogs/ConfirmDialog";

interface Props {
  defaultDateFrom?: Date;
  defaultDateTo?: Date;
}

const ExchangeRateTable = ({ defaultDateFrom, defaultDateTo }: Props) => {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [from, setFrom] = useState<Date | undefined>(defaultDateFrom);
  const [to, setTo] = useState<Date | undefined>(defaultDateTo);
  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
  });

  if (tenantId) {
    queryParams.append("tenantId", tenantId.toString());
  }
  if (from) {
    from.setHours(0, 0, 0, 0);
    queryParams.append("from", from.toISOString());
  }
  if (to) {
    to.setHours(23, 59, 59, 999);
    queryParams.append("to", to.toISOString());
  }

  const { exchangeRates, meta, isLoading, mutate } =
    useExchangeRates(queryParams);

  const handleSearch = async () => {
    setCurrentPage(1);
    await mutate();
  };

  const { trigger: deleteData } = useDelete("exchange-rates");
  const handleDelete = async (id: number) => {
    try {
      await deleteData(id);
      toast.success("Data deleted successfully!");
      await mutate();
    } catch {
      toast.error(`Failed to delete data`);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 items-center md:flex-nowrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full md:w-[150px] h-9 justify-start text-left font-normal text-xs",
                !from && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {from ? format(from, "PPP") : <span>From</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={from}
              onSelect={setFrom}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full md:w-[150px] h-9 justify-start text-left font-normal text-xs",
                !from && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {to ? format(to, "PPP") : <span>To</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={to}
              onSelect={setTo}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button onClick={handleSearch} className="">
          <Search className="w-5 h-5" />
        </Button>
      </div>
      <Table className="table-auto w-full text-xs text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Exchange</TableHead>
            <TableHead>Buy Rate</TableHead>
            <TableHead>Sell Rate</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Actions</TableHead>
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
                <TableCell>{data.name}</TableCell>
                <TableCell>
                  {data.baseCurrency.name} - {data.quoteCurrency.name}
                </TableCell>
                <TableCell>{data.buyRate}</TableCell>
                <TableCell>{data.sellRate}</TableCell>
                <TableCell>
                  {new Date(data.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-0">
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
                      onConfirm={() => handleDelete(data.id)}
                    />
                  </div>
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
