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
import { ConfirmDialog } from "../dialogs/ConfirmDialog";

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
  defaultTransactionTypeId?: number;
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
  defaultTransactionTypeId,
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
  const [transactionTypeId, setTransactionTypeId] = useState<
    string | undefined
  >(defaultTransactionTypeId ? defaultTransactionTypeId.toString() : undefined);
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
  if (transactionTypeId)
    queryParams.append("transactionTypeId", transactionTypeId.toString());
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
    // const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    // if (!confirmed) return;
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
      <div className="flex flex-wrap gap-2 mb-4 items-center md:flex-nowrap">
        {supplierList && (
          <Select
            onValueChange={(value) => setSupplierId(value)}
            defaultValue={supplierId}
          >
            <SelectTrigger className="w-full md:w-[200px] h-9 text-xs truncate">
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
            <SelectTrigger className="w-full md:w-[200px] h-9 text-xs truncate">
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
            onValueChange={(value) =>
              setTransactionTypeId(value === "all" ? undefined : value)
            }
            defaultValue={transactionTypeId}
          >
            <SelectTrigger className="w-full md:w-[200px] h-9 text-xs truncate">
              <SelectValue
                placeholder="Select Transaction Type"
                className="truncate text-xs"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
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
            <SelectTrigger className="w-full md:w-[200px] h-9 text-xs truncate">
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
            <SelectTrigger className="w-full md:w-[200px] h-9 text-xs truncate">
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
            <SelectTrigger className="w-full md:w-[200px] h-9 text-xs truncate">
              <SelectValue
                placeholder="Select Base Currency"
                className="truncate text-xs"
              />
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
            <SelectTrigger className="w-full md:w-[200px] h-9 text-xs truncate">
              <SelectValue
                placeholder="Select Quote Currency"
                className="truncate text-xs"
              />
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
        <Button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-600"
        >
          <FileSpreadsheet className="w-5 h-5" />
        </Button>
      </div>
      <Table className="table-auto w-full text-xs text-left">
        <TableHeader className="text-xs">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Amount(From)</TableHead>
            <TableHead>Amount(To)</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>TotalEarnings</TableHead>
            <TableHead>Actions</TableHead>
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
                <TableCell>
                  #TNX-{transaction.baseCurrency.name}-
                  {transaction.quoteCurrency.name}-{transaction.id}
                </TableCell>
                <TableCell>
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.Agent.name}</TableCell>
                <TableCell>{transaction.Supplier.name}</TableCell>
                <TableCell>
                  {transaction.baseCurrency.symbol}
                  {transaction.baseAmount}
                </TableCell>
                <TableCell>
                  {transaction.quoteCurrency.symbol}
                  {transaction.quoteAmountSell}{" "}
                  <span>({transaction.sellRate})</span>
                </TableCell>
                <TableCell>
                  {transaction.quoteCurrency.symbol}
                  {transaction.profit}
                </TableCell>
                <TableCell>
                  {transaction.quoteCurrency.symbol}
                  {transaction.commission}
                </TableCell>
                <TableCell>
                  {transaction.quoteCurrency.symbol}
                  {transaction.totalEarnings}
                  {transaction.TransactionProfit?.map((profit) => {
                    return (
                      <p className="text-blue-500" key={profit.id}>
                        {profit.profitAmount}({profit.Currency.symbol})
                      </p>
                    );
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-0">
                    <Button
                      size={null}
                      variant="ghost"
                      className="w-5 h-5 p-0 min-w-0 cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/transactions/${transaction.id}`)
                      }
                    >
                      <View className="w-3 h-3" />
                    </Button>

                    <Button
                      size={null}
                      variant="ghost"
                      className="w-5 h-5 p-0 min-w-0 cursor-pointer"
                      onClick={() => handleEdit(transaction)}
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
                      title="Delete Transaction"
                      description="Are you sure you want to delete this transaction?"
                      confirmText="Delete"
                      onConfirm={() => handleDelete(transaction.id)}
                    />

                    {transaction.agentPaymentStatus !== "PAID" && (
                      <Button
                        size={null}
                        variant="ghost"
                        className="w-5 h-5 p-0 min-w-0 cursor-pointer"
                        onClick={() => handleDirectAgentPayment(transaction)}
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}

                    {transaction.supplierPaymentStatus !== "PAID" && (
                      <Button
                        size={null}
                        variant="ghost"
                        className="w-5 h-5 p-0 min-w-0 cursor-pointer"
                        onClick={() => handleDirectSupplierPayment(transaction)}
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
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
        <p className="text-xs">
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
