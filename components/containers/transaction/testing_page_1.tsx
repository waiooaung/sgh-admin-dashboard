// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import useSWR, { mutate } from "swr";
// import fetcher from "@/lib/fetcher";
// import {
//   ArrowLeft,
//   ArrowRight,
//   ArrowLeftRight,
//   JapaneseYen,
//   DollarSign,
//   CircleDollarSign,
// } from "lucide-react";
// import Link from "next/link";
// import { GetServerSideProps } from "next";
// import FilterBar from "@/components/filter-bar";
// import { DateRange } from "react-day-picker";
// import { MetaData } from "@/types/meta-data";
// import { CreateTransaction, Transaction } from "@/types/transaction";
// import { AddNewTransaction } from "@/components/dialogs/add-new-transaction";

// interface Overview {
//   totalTransactions: number;
//   totalEarningsUSD: number;
//   totalProfitUSD: number;
//   totalAmountRMB: number;
// }

// interface ApiResponse {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: Transaction[];
//   meta: MetaData;
//   overview: Overview;
// }

// interface TransactionContainerProps {
//   initialData?: ApiResponse;
// }

// const TransactionContainer = ({ initialData }: TransactionContainerProps) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const itemsPerPage = 10;

//   const initialPage =
//     Number(searchParams.get("page")) || initialData?.meta?.currentPage || 1;
//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [agentFilter, setAgentFilter] = useState<string>("");
//   const [supplierFilter, setSupplierFilter] = useState<string>("");
//   const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
//   const [reloadData, setReloadData] = useState(false);

//   const buildQueryParams = () => {
//     const params = new URLSearchParams();
//     params.set("page", String(currentPage));
//     params.set("limit", String(itemsPerPage));

//     if (agentFilter) params.set("agentId", agentFilter);
//     if (supplierFilter) params.set("supplierId", supplierFilter);
//     if (dateRange?.from && dateRange?.to) {
//       params.set("from", dateRange.from.toISOString());
//       params.set("to", dateRange.to.toISOString());
//     }

//     return params.toString();
//   };

//   const { data, error, isLoading } = useSWR<ApiResponse>(
//     `/transactions?${buildQueryParams()}`,
//     fetcher,
//     { fallbackData: initialData },
//   );

//   const transactions = data?.data || [];
//   const meta = data?.meta || {
//     totalItems: 0,
//     totalPages: 1,
//     currentPage: 1,
//     itemsPerPage,
//   };
//   const overview: Overview = {
//     totalTransactions: data?.overview?.totalTransactions || 0,
//     totalEarningsUSD: data?.overview?.totalEarningsUSD || 0,
//     totalProfitUSD: data?.overview?.totalProfitUSD || 0,
//     totalAmountRMB: data?.overview?.totalAmountRMB || 0,
//   };

//   const updatePage = (newPage: number) => {
//     setCurrentPage(newPage);
//     router.replace(
//       `/dashboard/transactions?page=${newPage}&limit=${itemsPerPage}&from=${dateRange?.from}&to=${dateRange?.to}`,
//       { scroll: false },
//     );
//   };

//   const handleSearch = (
//     supplierFilter: string,
//     agentFilter: string,
//     dateRange: DateRange | undefined,
//   ) => {
//     setSupplierFilter(supplierFilter);
//     setAgentFilter(agentFilter);
//     setDateRange(dateRange);

//     // Construct new query params
//     const params = new URLSearchParams();
//     params.set("page", "1"); // Reset to first page when filtering
//     params.set("limit", String(itemsPerPage));

//     if (supplierFilter) params.set("supplierId", supplierFilter);
//     if (agentFilter) params.set("agentId", agentFilter);
//     if (dateRange?.from && dateRange?.to) {
//       params.set("from", dateRange.from.toISOString());
//       params.set("to", dateRange.to.toISOString());
//     }

//     // Update URL with new filters
//     router.replace(`/dashboard/transactions?${params.toString()}`, {
//       scroll: false,
//     });

//     // Trigger SWR re-fetch
//     mutate(`/transactions?${params.toString()}`);
//   };

//   const handleNewTransaction = (newTransaction: CreateTransaction) => {
//     mutate(`/transactions?${buildQueryParams()}`);
//   };

//   if (error)
//     return <p className="text-red-500">Failed to load transactions.</p>;
//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className="flex flex-1 flex-col space-y-4 p-4">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
//         <p className="text-lg font-semibold tracking-tight">Transactions</p>
//         <AddNewTransaction onTransactionCreated={handleNewTransaction}/>
//       </div>

//       <div className="grid grid-cols-1 gap-4">
//         <FilterBar
//           fields={[
//             {
//               type: "select",
//               name: "supplierFilter",
//               options: [
//                 { label: "Supplier 1", value: "1" },
//                 { label: "Supplier 2", value: "2" },
//                 { label: "Supplier 3", value: "3" },
//               ],
//               placeholder: "Supplier",
//               value: supplierFilter,
//             },
//             {
//               type: "select",
//               name: "agentFilter",
//               options: [
//                 { label: "Agent 1", value: "1" },
//                 { label: "Agent 2", value: "2" },
//                 { label: "Agent 3", value: "3" },
//               ],
//               placeholder: "Agent",
//               value: agentFilter,
//             },
//             {
//               type: "dateRange",
//               name: "transactionDateRange",
//               value: dateRange,
//             },
//           ]}
//           onFilterChange={({
//             supplierFilter,
//             agentFilter,
//             transactionDateRange,
//           }) => handleSearch(supplierFilter, agentFilter, transactionDateRange)}
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           {
//             label: "Total Transactions",
//             value: overview.totalTransactions,
//             icon: ArrowLeftRight,
//           },
//           {
//             label: "Total Revenue",
//             value: overview.totalEarningsUSD,
//             icon: JapaneseYen,
//           },
//           {
//             label: "Total Profit",
//             value: overview.totalProfitUSD,
//             icon: DollarSign,
//           },
//           {
//             label: "Total Amount Exchanged",
//             value: overview.totalAmountRMB,
//             icon: CircleDollarSign,
//           },
//         ].map((card, idx) => (
//           <Card key={idx}>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium truncate">
//                 {card.label}
//               </CardTitle>
//               <card.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <Link href="/dashboard/transactions">
//                 <div className="text-2xl font-bold text-blue-600 truncate">
//                   {new Intl.NumberFormat("en-US", {
//                     minimumFractionDigits: card.value % 1 === 0 ? 0 : 2,
//                     maximumFractionDigits: 2,
//                   }).format(card.value)}
//                 </div>
//               </Link>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>Transactions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
//               <TableHeader className="text-sm font-semibold">
//                 <TableRow>
//                   <TableHead className="p-3 text-left">Date</TableHead>
//                   <TableHead className="p-3 text-left">Amount (RMB)</TableHead>
//                   <TableHead className="p-3 text-left">Buy Rate</TableHead>
//                   <TableHead className="p-3 text-left">Sell Rate</TableHead>
//                   <TableHead className="p-3 text-left">Profit (USD)</TableHead>
//                   <TableHead className="p-3 text-left">
//                     Commission (USD)
//                   </TableHead>
//                   <TableHead className="p-3 text-left">
//                     Total Earnings (USD)
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {transactions.map((transaction) => (
//                   <TableRow
//                     key={transaction.id}
//                     className="hover:bg-blend-color transition-colors"
//                   >
//                     <TableCell className="p-3">
//                       {new Date(
//                         transaction.transactionDate,
//                       ).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell className="p-3">
//                       {transaction.amountRMB.toLocaleString()}
//                     </TableCell>
//                     <TableCell className="p-3">{transaction.buyRate}</TableCell>
//                     <TableCell className="p-3">
//                       {transaction.sellRate}
//                     </TableCell>
//                     <TableCell className="p-3">
//                       ${transaction.profitUSD.toFixed(2)}
//                     </TableCell>
//                     <TableCell className="p-3">
//                       ${transaction.commissionUSD.toFixed(2)}
//                     </TableCell>
//                     <TableCell className="p-3">
//                       ${transaction.totalEarningsUSD.toFixed(2)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             {/* Pagination Controls */}
//             <div className="flex justify-between items-center mt-4">
//               <Button
//                 onClick={() => updatePage(meta.currentPage - 1)}
//                 disabled={meta.currentPage === 1}
//                 className="flex items-center gap-2"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Previous
//               </Button>

//               <span className="text-sm font-medium">
//                 Page {meta.currentPage} of {meta.totalPages}
//               </span>

//               <Button
//                 onClick={() => updatePage(meta.currentPage + 1)}
//                 disabled={meta.currentPage >= meta.totalPages}
//                 className="flex items-center gap-2"
//               >
//                 Next
//                 <ArrowRight className="w-4 h-4" />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// // Fetch initial data on the server
// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const page = query.page ? parseInt(query.page as string, 10) : 1;
//   const limit = query.limit ? parseInt(query.limit as string, 10) : 2;

//   try {
//     const initialData: ApiResponse = await fetcher(
//       `/transactions?page=${page}&limit=${limit}`,
//     );
//     return { props: { initialData } };
//   } catch (error) {
//     console.error("Failed to fetch initial transactions:", error);
//     return { props: { initialData: null } };
//   }
// };

// export default TransactionContainer;

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
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  JapaneseYen,
  DollarSign,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";
import FilterBar from "@/components/filter-bar";
import { DateRange } from "react-day-picker";
import { MetaData } from "@/types/meta-data";
import { Transaction } from "@/types/transaction";
import { AddNewTransaction } from "@/components/dialogs/add-new-transaction";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 10;

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

  const page = Number(searchParams.get("page")) || 1;
  const agentFilter = searchParams.get("agentId") || "";
  const supplierFilter = searchParams.get("supplierId") || "";

  const { data, error, mutate } = useSWR<ApiResponse>(
    `/transactions?page=${page}&limit=${itemsPerPage}&agentId=${agentFilter}&supplierId=${supplierFilter}&from=${dateRange?.from?.toISOString()}&to=${dateRange?.to?.toISOString()}`,
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

  const updatePage = (newPage: number) => {
    router.replace(
      `/dashboard/transactions?page=${newPage}&limit=${itemsPerPage}&agentId=${agentFilter}&supplierId=${supplierFilter}&from=${dateRange?.from?.toISOString()}&to=${dateRange?.to?.toISOString()}`,
      { scroll: false },
    );
  };

  const handleSearch = (
    supplierFilter: string,
    agentFilter: string,
    dateRange: DateRange | undefined,
  ) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", String(itemsPerPage));
    if (supplierFilter) params.set("supplierId", supplierFilter);
    if (agentFilter) params.set("agentId", agentFilter);
    if (dateRange?.from && dateRange?.to) {
      params.set("from", dateRange.from.toISOString());
      params.set("to", dateRange.to.toISOString());
    }
    router.replace(`/dashboard/transactions?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleNewTransaction = async () => {
    toast.info("New transaction created.");
  };

  if (error)
    return <p className="text-red-500">Failed to load transactions.</p>;
  // if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Transactions</p>
        <AddNewTransaction onSuccess={() => handleNewTransaction} />
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
                  <TableHead className="p-3 text-left">Buy Rate</TableHead>
                  <TableHead className="p-3 text-left">Sell Rate</TableHead>
                  <TableHead className="p-3 text-left">Profit (USD)</TableHead>
                  <TableHead className="p-3 text-left">
                    Commission (USD)
                  </TableHead>
                  <TableHead className="p-3 text-left">
                    Total Earnings (USD)
                  </TableHead>
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
                      {transaction.amountRMB.toLocaleString()}
                    </TableCell>
                    <TableCell className="p-3">{transaction.buyRate}</TableCell>
                    <TableCell className="p-3">
                      {transaction.sellRate}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => updatePage(meta.currentPage - 1)}
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
                onClick={() => updatePage(meta.currentPage + 1)}
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
