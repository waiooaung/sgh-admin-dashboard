import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  FileSpreadsheet,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "./pagination-controls";
import TransactedRateSkeleton from "./transacted-rate-skeleton";
import { useAuth } from "@/context/authContext";
import * as XLSX from "xlsx";
import { useTransactions } from "@/hooks/useTransactions";

interface TransactedRateTableProps {
  defaultDateFrom?: Date;
  defaultDateTo?: Date;
}

const TransactedRateTable = ({
  defaultDateFrom,
  defaultDateTo,
}: TransactedRateTableProps) => {
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

  const { transactionsData, metaData, isLoading, mutate } =
    useTransactions(queryParams);

  const transactions = transactionsData || [];
  const meta = metaData || { totalItems: 0, totalPages: 0, currentPage: 1 };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    mutate();
  };

  const handleSearch = () => {
    setCurrentPage(1);
    mutate();
  };

  const exportToExcel = () => {
    if (transactions.length === 0) {
      alert("No transactions to export!");
      return;
    }

    const dataToExport = transactions.map((transaction) => ({
      ID: `#TNX-${transaction.id}`,
      "Transaction Type": `${transaction.baseCurrency.name} - ${transaction.quoteCurrency.name}`,
      "Amount From": `${transaction.baseCurrency.symbol} ${transaction.baseAmount}`,
      "Buy Rate": `${transaction.buyRate}`,
      "Sell Rate": `${transaction.sellRate}`,
      Date: new Date(transaction.transactionDate).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    XLSX.writeFile(workbook, "transacted_rates.xlsx");
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
        <Button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-600"
        >
          <FileSpreadsheet className="w-5 h-5" />
        </Button>
      </div>
      <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <TableHeader className="text-sm font-semibold">
          <TableRow>
            <TableHead className="text-left truncate">ID</TableHead>
            <TableHead className="text-left truncate">
              Transaction Type
            </TableHead>
            <TableHead className="text-left truncate text-blue-500">
              Buy Rate
            </TableHead>
            <TableHead className="text-left truncate text-green-500">
              Sell Rate
            </TableHead>
            <TableHead className="text-left truncate">Date</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TransactedRateSkeleton />
        ) : (
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="hover:bg-blend-color transition-colors"
              >
                <TableCell className="truncate">
                  #TNX-{transaction.id}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.baseCurrency.name} -{" "}
                  {transaction.quoteCurrency.name}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.buyRate}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.sellRate}
                </TableCell>
                <TableCell className="truncate">
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
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

export default TransactedRateTable;
