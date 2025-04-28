import useSWR from "swr";
import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  View,
  Pencil,
  Trash,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "./pagination-controls";
import { Transaction } from "@/types/transaction";
import { MetaData } from "@/types/meta-data";
import TransactionSkeletonTable from "./transaction-skeleton-table";
import EditTransaction from "@/components/dialogs/edit-transaction";
import useDeleteTransaction from "@/hooks/useDeleteTransaction";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import * as XLSX from "xlsx";
import { Agent } from "@/types/agent";
import { Supplier } from "@/types/supplier";
import { TransactionType } from "@/types/transactionType";
import { AddDirectAgentPayment } from "../dialogs/add-direct-agent-payment";
import { AddDirectSupplierPayment } from "../dialogs/add-direct-supplier-payment";
import { Currency } from "@/types/currency";
import { useSearchParams } from "next/navigation";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Transaction[];
  meta: MetaData;
}

type PaymentStatus = "PENDING" | "PARTIALLY_PAID" | "PAID";

interface TransactionTableProps {
  agentList?: Agent[];
  supplierList?: Supplier[];
  transactionTypeList?: TransactionType[];
  agentPaymentStatusList?: PaymentStatus[];
  supplierPaymentStatusList?: PaymentStatus[];
  currencyList?: Currency[];
  defaultSupplierId?: number;
  defaultAgentId?: number;
  defaultDateFrom?: Date;
  defaultDateTo?: Date;
  defaultAgentPaymentStatus?: PaymentStatus[];
  defaultSupplierPaymentStatus?: PaymentStatus[];
  defaultBaseCurrencyId?: number;
  defaultQuoteCurrencyId?: number;
}

const TransactionTable = ({
  agentList,
  supplierList,
  transactionTypeList,
  agentPaymentStatusList,
  supplierPaymentStatusList,
  currencyList,
  defaultSupplierId,
  defaultAgentId,
  defaultDateFrom,
  defaultDateTo,
  defaultAgentPaymentStatus,
  defaultSupplierPaymentStatus,
  defaultBaseCurrencyId,
  defaultQuoteCurrencyId,
}: TransactionTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : 0;
  const { trigger: deleteTransaction } = useDeleteTransaction();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [open, setOpen] = useState<boolean>(false);
  const [directAgentPaymentOpen, setDirectAgentPaymentOpen] =
    useState<boolean>(false);
  const [directSupplierPaymentOpen, setDirectSupplierPaymentOpen] =
    useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [supplierId, setSupplierId] = useState<string | undefined>(
    defaultSupplierId ? defaultSupplierId.toString() : undefined,
  );
  const [agentId, setAgentId] = useState<string | undefined>(
    defaultAgentId ? defaultAgentId.toString() : undefined,
  );
  const [from, setFrom] = useState<Date | undefined>(defaultDateFrom);
  const [to, setTo] = useState<Date | undefined>(defaultDateTo);
  const [agentPaymentStatus, setAgentPaymentStatus] = useState<
    PaymentStatus[] | undefined
  >(defaultAgentPaymentStatus);
  const [supplierPaymentStatus, setSupplierPaymentStatus] = useState<
    PaymentStatus[] | undefined
  >(defaultSupplierPaymentStatus);
  const [baseCurrencyId, setBaseCurrencyId] = useState<number | undefined>(
    defaultBaseCurrencyId,
  );
  const [quoteCurrencyId, setQuoteCurrencyId] = useState<number | undefined>(
    defaultQuoteCurrencyId,
  );

  const queryParams = new URLSearchParams({
    tenantId: tenantId.toString(),
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
  });

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
  if (agentPaymentStatus) {
    agentPaymentStatus.forEach((status) => {
      queryParams.append("agentPaymentStatus", status);
    });
  }
  if (supplierPaymentStatus) {
    supplierPaymentStatus.forEach((status) => {
      queryParams.append("supplierPaymentStatus", status);
    });
  }

  if (baseCurrencyId)
    queryParams.append("baseCurrencyId", baseCurrencyId.toString());
  if (quoteCurrencyId)
    queryParams.append("quoteCurrencyId", quoteCurrencyId.toString());

  useEffect(() => {
    const baseCurrencyIdParam = searchParams.get("baseCurrencyId");
    const quoteCurrencyIdParam = searchParams.get("quoteCurrencyId");

    setBaseCurrencyId(
      baseCurrencyIdParam ? parseInt(baseCurrencyIdParam) : undefined,
    );
    setQuoteCurrencyId(
      quoteCurrencyIdParam ? parseInt(quoteCurrencyIdParam) : undefined,
    );
  }, [searchParams]);

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
      "Transaction ID": `#TNX-${transaction.id}`,
      Date: new Date(transaction.transactionDate).toLocaleDateString(),
      "Transaction Type": `${transaction.baseCurrency.name} - ${transaction.quoteCurrency.name}`,
      "Amount From": `${transaction.baseCurrency.symbol} ${transaction.baseAmount}`,
      "Amount To (Buy Rate)": `${transaction.quoteCurrency.symbol} ${transaction.quoteAmountBuy} (${transaction.buyRate})`,
      "Amount To (Sell Rate)": `${transaction.quoteCurrency.symbol} ${transaction.quoteAmountSell} (${transaction.sellRate})`,
      Profit: `${transaction.quoteCurrency.symbol} ${transaction.profit}`,
      Commission: `${transaction.quoteCurrency.symbol} ${transaction.commission}`,
      "Total Earnings": `${transaction.quoteCurrency.symbol} ${transaction.totalEarnings}`,
      "Agent Name": transaction.Agent.name,
      "Supplier Name": transaction.Supplier.name,
      "Agent Payment Status": transaction.agentPaymentStatus,
      "Supplier Payment Status": transaction.supplierPaymentStatus,
      "Amount Received From Agent": transaction.amountReceivedFromAgent,
      "Remaining Amount From Agent": transaction.remainingAmountFromAgent,
      "Amount Paid To Supplier": transaction.amountPaidToSupplier,
      "Remaining Amount To Pay To Supplier":
        transaction.remainingAmountToPayToSupplier,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleDirectAgentPayment = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDirectAgentPaymentOpen(true);
  };

  const handleDirectSupplierPayment = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDirectSupplierPaymentOpen(true);
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
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {supplierList && (
          <Select
            onValueChange={(value) => setSupplierId(value)}
            defaultValue={supplierId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Supplier" />
            </SelectTrigger>
            <SelectContent>
              {supplierList?.length > 0 &&
                supplierList?.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}

        {agentList && (
          <Select
            onValueChange={(value) => setAgentId(value)}
            defaultValue={agentId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {agentList?.length > 0 &&
                agentList?.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    {agent.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}

        {transactionTypeList && (
          <Select
            onValueChange={(value) => setAgentId(value)}
            defaultValue={agentId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {transactionTypeList?.length > 0 &&
                transactionTypeList?.map((transactionType) => (
                  <SelectItem
                    key={transactionType.id}
                    value={transactionType.id.toString()}
                  >
                    {transactionType.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}

        {agentPaymentStatusList && (
          <Select
            onValueChange={(value: PaymentStatus) =>
              setAgentPaymentStatus([value])
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {agentPaymentStatusList?.length > 0 &&
                agentPaymentStatusList?.map((agentPaymentStatus) => (
                  <SelectItem
                    key={agentPaymentStatus}
                    value={agentPaymentStatus}
                  >
                    {agentPaymentStatus}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}

        {supplierPaymentStatusList && (
          <Select
            onValueChange={(value: PaymentStatus) =>
              setSupplierPaymentStatus([value])
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {supplierPaymentStatusList?.length > 0 &&
                supplierPaymentStatusList?.map((supplierPaymentStatus) => (
                  <SelectItem
                    key={supplierPaymentStatus}
                    value={supplierPaymentStatus}
                  >
                    {supplierPaymentStatus}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}

        {currencyList && (
          <Select
            onValueChange={(value: string) =>
              setBaseCurrencyId(parseInt(value))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Base Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyList?.length > 0 &&
                currencyList?.map((currency) => (
                  <SelectItem key={currency.id} value={currency.name}>
                    {currency.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}

        {currencyList && (
          <Select
            onValueChange={(value: string) =>
              setQuoteCurrencyId(parseInt(value))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Quote Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyList?.length > 0 &&
                currencyList?.map((currency) => (
                  <SelectItem key={currency.id} value={currency.name}>
                    {currency.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}

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
            <TableHead className="text-left truncate">Date</TableHead>
            <TableHead className="text-left truncate">Amount (From)</TableHead>
            <TableHead className="text-left truncate">
              Amount (To) <span className="text-green-500">(Sell Rate)</span>
            </TableHead>
            <TableHead className="text-left truncate">Amount Due</TableHead>
            <TableHead className="text-left truncate">Amount Owed</TableHead>
            <TableHead className="text-left truncate">Profit</TableHead>
            <TableHead className="text-left truncate">Commission</TableHead>
            <TableHead className="text-left truncate">Total Earnings</TableHead>
            <TableHead className="text-left truncate">
              Payment Status (Customer)
            </TableHead>
            <TableHead className="text-left truncate">
              Payment Status (Supplier)
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
                <TableCell className="truncate">
                  #TNX-{transaction.baseCurrency.name}-
                  {transaction.quoteCurrency.name}-{transaction.id}
                </TableCell>
                <TableCell className="truncate">
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.baseCurrency.symbol} {transaction.baseAmount}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.quoteCurrency.symbol}{" "}
                  {transaction.quoteAmountSell}
                  <span>({transaction.sellRate})</span>
                </TableCell>
                <TableCell className="truncate">
                  {transaction.quoteCurrency.symbol}{" "}
                  {transaction.remainingAmountFromAgent}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.quoteCurrency.symbol}{" "}
                  {transaction.remainingAmountToPayToSupplier}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.quoteCurrency.symbol} {transaction.profit}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.quoteCurrency.symbol} {transaction.commission}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.quoteCurrency.symbol} {transaction.totalEarnings}
                  {transaction.TransactionProfit?.map((profit) => {
                    return (
                      <p className="text-blue-500" key={profit.id}>
                        {profit.profitAmount}({profit.Currency.symbol})
                      </p>
                    );
                  })}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.agentPaymentStatus}
                </TableCell>
                <TableCell className="truncate">
                  {transaction.supplierPaymentStatus}
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
                      {transaction.agentPaymentStatus !== "PAID" && (
                        <DropdownMenuItem
                          onClick={() => handleDirectAgentPayment(transaction)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Apply
                          Customer Payment
                        </DropdownMenuItem>
                      )}
                      {transaction.supplierPaymentStatus !== "PAID" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleDirectSupplierPayment(transaction)
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Apply
                          Supplier Payment
                        </DropdownMenuItem>
                      )}
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

      {selectedTransaction && (
        <AddDirectAgentPayment
          transaction={selectedTransaction}
          onSuccess={() => {
            setDirectAgentPaymentOpen(false);
          }}
          isOpen={directAgentPaymentOpen}
          setIsOpen={setDirectAgentPaymentOpen}
        />
      )}

      {selectedTransaction && (
        <AddDirectSupplierPayment
          transaction={selectedTransaction}
          onSuccess={() => {
            setDirectSupplierPaymentOpen(false);
          }}
          isOpen={directSupplierPaymentOpen}
          setIsOpen={setDirectSupplierPaymentOpen}
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
