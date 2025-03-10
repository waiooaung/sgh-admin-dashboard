// "use client";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import {
//   LineChart,
//   BarChart,
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   ArrowLeftRight,
//   CircleDollarSign,
//   DollarSign,
//   JapaneseYen,
// } from "lucide-react";

// import Link from "next/link";
// import { useState } from "react";

// import { ExchangeRateCard } from "@/components/cards/exchange-rate-card";

// import { Transaction } from "@/types/transaction";
// import { MetaData } from "@/types/meta-data";
// import useSWR from "swr";
// import fetcher from "@/lib/fetcher";
// import { toast } from "sonner";
// import useDashboardStats from "@/hooks/useDashboardStats";

// interface Overview {
//   totalTransactions: number;
//   totalEarningsUSD: number;
//   totalProfitUSD: number;
//   totalAmountRMB: number;
// }

// interface TransactionApiResponse {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: Transaction[];
//   meta: MetaData;
//   overview: Overview;
// }

// export default function DashboardContainer() {
//   const { data, error } = useSWR<TransactionApiResponse>(`/transactions?limit=20&&page=1`, fetcher);
//   const recentTransactions: Transaction[] = data?.data || [];

//   if (error)
//     return toast.error("Failed to load recent transactions");

//   const stats = useDashboardStats();
//   const { totalTransactions, totalEarningsUSD, totalProfitUSD, supplierCount, agentCount } = stats.data || {
//     totalTransactions: 0,
//     totalEarningsUSD: 0,
//     totalProfitUSD: 0,
//     supplierCount: 0,
//     agentCount: 0,
//   };

//   const profitData = [
//     { date: "Feb 1", profit: 150.25 },
//     { date: "Feb 2", profit: 300.75 },
//     { date: "Feb 3", profit: 250.6 },
//     { date: "Feb 4", profit: 450.1 },
//     { date: "Feb 5", profit: 600.55 },
//     { date: "Feb 6", profit: 500.9 },
//     { date: "Feb 7", profit: 700.3 },
//     { date: "Feb 8", profit: 850.45 },
//     { date: "Feb 9", profit: 900.8 },
//     { date: "Feb 10", profit: 750.25 },
//     { date: "Feb 11", profit: 950.7 },
//     { date: "Feb 12", profit: 1100.95 },
//     { date: "Feb 13", profit: 1300.15 },
//     { date: "Feb 14", profit: 1200.4 },
//     { date: "Feb 15", profit: 1400.65 },
//     { date: "Feb 16", profit: 1550.85 },
//     { date: "Feb 17", profit: 1650.05 },
//     { date: "Feb 18", profit: 1750.35 },
//     { date: "Feb 19", profit: 1800.5 },
//     { date: "Feb 20", profit: 1950.75 },
//     { date: "Feb 21", profit: 2100.95 },
//     { date: "Feb 22", profit: 2250.6 },
//     { date: "Feb 23", profit: 2400.3 },
//     { date: "Feb 24", profit: 2600.4 },
//     { date: "Feb 25", profit: 2750.9 },
//     { date: "Feb 26", profit: 2900.15 },
//     { date: "Feb 27", profit: 3100.25 },
//     { date: "Feb 28", profit: 3300.75 },
//   ];

//   const transactionData = [
//     { date: "Oct 1", transactions: 10.0 },
//     { date: "Oct 2", transactions: 20.0 },
//     { date: "Oct 3", transactions: 15.0 },
//     { date: "Oct 4", transactions: 25.0 },
//     { date: "Oct 5", transactions: 30.0 },
//     { date: "Oct 6", transactions: 22.5 },
//     { date: "Oct 7", transactions: 18.0 },
//     { date: "Oct 8", transactions: 27.0 },
//     { date: "Oct 9", transactions: 35.0 },
//     { date: "Oct 10", transactions: 40.0 },
//   ];

//   return (
//     <div className="flex flex-1 flex-col space-y-4 p-4">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
//         <p className="text-lg font-semibold tracking-tight">
//           Hi, Welcome back 👋
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium truncate">
//               Total Transactions
//             </CardTitle>
//             <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <Link href="/transactions?date=25-02-2025">
//               <div className="text-2xl font-bold text-blue-600 truncate">
//                 {totalTransactions}
//               </div>
//             </Link>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium truncate">
//               Total Revenue
//             </CardTitle>
//             <JapaneseYen className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <Link href="/transactions">
//               <div className="text-2xl font-bold text-blue-600 truncate">
//                 {new Intl.NumberFormat("en-US").format(totalEarningsUSD)}
//               </div>
//             </Link>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium truncate">
//               Total Profit
//             </CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <Link href="/transactions">
//               <div className="text-2xl font-bold text-blue-600 truncate">
//                 ${new Intl.NumberFormat("en-US").format(totalProfitUSD)}
//               </div>
//             </Link>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium truncate">
//               Total Amount Exchanged
//             </CardTitle>
//             <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <Link href="/transactions?status=partially_paid">
//               <div className="text-2xl font-bold text-red-600 truncate">
//                 ${new Intl.NumberFormat("en-US").format(supplierCount)}
//               </div>
//             </Link>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium truncate">
//               Total Amount Exchanged
//             </CardTitle>
//             <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <Link href="/transactions?status=partially_paid">
//               <div className="text-2xl font-bold text-red-600 truncate">
//                 ${new Intl.NumberFormat("en-US").format(agentCount)}
//               </div>
//             </Link>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 gap-4">
//         <ExchangeRateCard />
//         <Card>
//           <CardHeader>
//             <CardTitle>Profit Overview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={profitData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="profit" stroke="#8884d8" />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Transaction Volume</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={transactionData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="transactions" fill="#82ca9d" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Transactions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
//               <TableHeader className="text-sm font-semibold">
//                 <TableRow>
//                   <TableHead className="p-3 text-left">Date</TableHead>
//                   <TableHead className="p-3 text-left">Amount (RMB)</TableHead>
//                   <TableHead className="p-3 text-left">Amount USD <span className="text-blue-500">(Buy Rate)</span></TableHead>
//                   <TableHead className="p-3 text-left">Amount USD <span className="text-green-500">(Sell Rate)</span></TableHead>
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
//                 {recentTransactions.map((transaction) => (
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
//                     &#165; {transaction.amountRMB.toLocaleString()}
//                     </TableCell>
//                     <TableCell className="p-3">${transaction.amountUSDBuy.toFixed(2)} ( {transaction.buyRate} )</TableCell>
//                     <TableCell className="p-3">
//                     ${transaction.amountUSDSell.toFixed(2)} ( {transaction.sellRate} )
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
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
