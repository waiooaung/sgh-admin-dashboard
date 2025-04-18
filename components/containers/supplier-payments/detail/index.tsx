"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import useDataContext from "@/hooks/useDataContext";

const SupplierDetailContainer = () => {
  const { supplierPayment } = useDataContext();

  if (!supplierPayment) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p className="text-gray-500 text-lg">
          No supplier payment information available.
        </p>
      </div>
    );
  }
  const supplier = supplierPayment.Supplier;
  const appliedTransactions = supplierPayment.appliedTransactions;
  const currency = supplierPayment.Currency;

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Supplier Payment Detail
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 gap-4">
          <Card className="border shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm">
              <p>
                <strong>Payment Date:</strong>{" "}
                {new Date(supplierPayment.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Amount ({currency.name}): </strong>
                {currency.symbol}
                {supplierPayment.amountPaid.toFixed(2)}
              </p>
              <p>
                <strong>Payment Type:</strong>{" "}
                {supplierPayment.paymentType || "N/A"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(supplierPayment.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(supplierPayment.updatedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="border shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src="" alt={supplier.name} />
                <AvatarFallback>{supplier.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{supplier.name}</h1>
                <p className="text-gray-500 text-sm">{supplier.contactEmail}</p>
              </div>
            </CardContent>
            <CardContent className="grid grid-cols-1 gap-4 text-sm">
              <p>
                <strong>Phone:</strong> {supplier.contactPhone}
              </p>
              <p>
                <strong>Bank Account:</strong> {supplier.bankAccount}
              </p>
              <p>
                <strong>Address:</strong> {supplier.address}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="border shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Applied Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
              <TableHeader className="text-sm font-semibold">
                <TableRow>
                  <TableHead className="text-left truncate">
                    Transaction Id
                  </TableHead>
                  <TableHead className="text-left truncate">
                    Transaction Status
                  </TableHead>
                  <TableHead className="text-left truncate">
                    Amount Applied ({currency.name})
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appliedTransactions?.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="hover:bg-blend-color transition-colors"
                  >
                    <TableCell className="w-15 truncate">
                      TNX-{transaction.transactionId}
                    </TableCell>
                    <TableCell className="truncate">
                      {transaction.SupplierTransaction.supplierPaymentStatus}
                    </TableCell>
                    <TableCell className="truncate">
                      {currency.symbol}
                      {transaction.amountApplied}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDetailContainer;
