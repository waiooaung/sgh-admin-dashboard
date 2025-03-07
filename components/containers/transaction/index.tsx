"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  JapaneseYen,
  DollarSign,
  CircleDollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import FilterBar from "@/components/filter-bar";
import { DateRange } from "react-day-picker";
import { MetaData } from "@/types/meta-data";
import { Transaction } from "@/types/transaction";
import { AddNewTransaction } from "@/components/dialogs/add-new-transaction";
import EditTransaction from "@/components/dialogs/edit-transaction";
import useDeleteTransaction from "@/hooks/useDeleteTransaction";
import { toast } from "sonner";

interface Overview {
  totalTransactions: number;
  totalEarningsUSD: number;
  totalProfitUSD: number;
  totalAmountRMB: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Transaction[];
  meta: MetaData;
  overview: Overview;
}

const TransactionContainer = () => {
  const searchParams = useSearchParams();

  // Get yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Get today's date
  const today = new Date();

  // Initialize dateRange with yesterday and today
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: yesterday,
    to: today,
  });

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    Number(searchParams.get("limit")) || 10,
  );
  const [agentFilter, setAgentFilter] = useState<string | undefined>(undefined);
  const [supplierFilter, setSupplierFilter] = useState<string | undefined>(
    undefined,
  );

  const [open, setOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const queryParams = new URLSearchParams({
    page: String(currentPage),
    limit: String(itemsPerPage),
  });

  if (agentFilter) queryParams.append("agentId", agentFilter);
  if (supplierFilter) queryParams.append("supplierId", supplierFilter);
  if (dateRange?.from) {
    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);
    queryParams.append("from", fromDate.toISOString());
  }
  if (dateRange?.to) {
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);
    queryParams.append("to", toDate.toISOString());
  }

  const { data, error, mutate } = useSWR<ApiResponse>(
    `/transactions?${queryParams}`,
    fetcher,
  );

  const transactions = data?.data || [];
  const meta = data?.meta || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage,
  };
  const overview = data?.overview || {
    totalTransactions: 0,
    totalEarningsUSD: 0,
    totalProfitUSD: 0,
    totalAmountRMB: 0,
  };

  const handleSearch = (
    supplierFilter: string,
    agentFilter: string,
    dateRange: DateRange | undefined,
  ) => {
    if (supplierFilter) setAgentFilter(supplierFilter);
    if (agentFilter) setSupplierFilter(agentFilter);
    if (dateRange?.from) setDateRange({ ...dateRange, from: dateRange.from });
    if (dateRange?.to) setDateRange({ ...dateRange, to: dateRange.to });
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const { trigger: deleteTransaction } = useDeleteTransaction();

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully!");
      mutate();
    } catch (error) {
      toast.error("Failed to delete transaction.")
    }
  };

  if (error)
    return <p className="text-red-500">Failed to load transactions.</p>;

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Transactions</p>
        <AddNewTransaction onSuccess={() => mutate()} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FilterBar
          fields={[
            {
              type: "select",
              name: "supplierFilter",
              options: [
                { label: "Supplier 1", value: "1" },
                { label: "Supplier 2", value: "2" },
                { label: "Supplier 3", value: "3" },
              ],
              placeholder: "Supplier",
              value: supplierFilter,
            },
            {
              type: "select",
              name: "agentFilter",
              options: [
                { label: "Agent 1", value: "1" },
                { label: "Agent 2", value: "2" },
                { label: "Agent 3", value: "3" },
              ],
              placeholder: "Agent",
              value: agentFilter,
            },
            {
              type: "dateRange",
              name: "transactionDateRange",
              value: dateRange,
            },
          ]}
          onFilterChange={({
            supplierFilter,
            agentFilter,
            transactionDateRange,
          }) => handleSearch(supplierFilter, agentFilter, transactionDateRange)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Transactions",
            value: overview.totalTransactions,
            icon: ArrowLeftRight,
          },
          {
            label: "Total Revenue",
            value: overview.totalEarningsUSD,
            icon: JapaneseYen,
          },
          {
            label: "Total Profit",
            value: overview.totalProfitUSD,
            icon: DollarSign,
          },
          {
            label: "Total Amount Exchanged",
            value: overview.totalAmountRMB,
            icon: CircleDollarSign,
          },
        ].map((card, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium truncate">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/transactions">
                <div className="text-2xl font-bold text-blue-600 truncate">
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: card.value % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2,
                  }).format(card.value)}
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
              <TableHeader className="text-sm font-semibold">
                <TableRow>
                  <TableHead className="p-3 text-left">Date</TableHead>
                  <TableHead className="p-3 text-left">Amount (RMB)</TableHead>
                  <TableHead className="p-3 text-left">Amount USD <span className="text-blue-500">(Buy Rate)</span></TableHead>
                  <TableHead className="p-3 text-left">Amount USD <span className="text-green-500">(Sell Rate)</span></TableHead>
                  <TableHead className="p-3 text-left">Profit (USD)</TableHead>
                  <TableHead className="p-3 text-left">
                    Commission (USD)
                  </TableHead>
                  <TableHead className="p-3 text-left">
                    Total Earnings (USD)
                  </TableHead>
                  <TableHead className="p-3 text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="hover:bg-blend-color transition-colors"
                  >
                    <TableCell className="p-3">
                      {new Date(
                        transaction.transactionDate,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="p-3">
                    &#165; {transaction.amountRMB.toLocaleString()}
                    </TableCell>
                    <TableCell className="p-3">${transaction.amountUSDBuy.toFixed(2)} ( {transaction.buyRate} )</TableCell>
                    <TableCell className="p-3">
                    ${transaction.amountUSDSell.toFixed(2)} ( {transaction.sellRate} )
                    </TableCell>
                    <TableCell className="p-3">
                      ${transaction.profitUSD.toFixed(2)}
                    </TableCell>
                    <TableCell className="p-3">
                      ${transaction.commissionUSD.toFixed(2)}
                    </TableCell>
                    <TableCell className="p-3">
                      ${transaction.totalEarningsUSD.toFixed(2)}
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
                            onClick={() => handleEdit(transaction)}
                          >
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
            </Table>
            <EditTransaction
              open={open}
              onClose={() => setOpen(false)}
              transaction={selectedTransaction}
              onSave={handleSave}
            />

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

export default TransactionContainer;
