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
import { Trash, MoreHorizontal, CalendarIcon, Search } from "lucide-react";
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
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !from && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {from ? format(from, "PPP") : <span>Pick from date</span>}
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
                "w-[280px] justify-start text-left font-normal",
                !to && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {to ? format(to, "PPP") : <span>Pick to date</span>}
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
