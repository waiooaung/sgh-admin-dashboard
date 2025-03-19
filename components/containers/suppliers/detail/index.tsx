"use client";

import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle } from "lucide-react";

import useDataContext from "@/hooks/useDataContext";
import SupplierOverview from "@/components/overviews/supplier-overview";
import TransactionTable from "@/components/tables/transaction-table";
import ContactButton from "@/components/contact-button";

const SupplierDetailContainer = () => {
  const { supplier } = useDataContext();
  if (!supplier) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p className="text-gray-500 text-lg">
          No supplier information available.
        </p>
      </div>
    );
  }

  const supplierId = supplier.id;

  const formattedLastLogin = supplier.updatedAt
    ? format(new Date(supplier.updatedAt), "MMM dd, yyyy h:mm a")
    : "N/A";

  const formattedCreatedAt = supplier.createdAt
    ? format(new Date(supplier.createdAt), "MMM dd, yyyy")
    : "N/A";

  const formattedUpdatedAt = supplier.updatedAt
    ? format(new Date(supplier.updatedAt), "MMM dd, yyyy")
    : "N/A";

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Supplier Detail</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Header Section */}
        <div className="flex items-center gap-6 p-6 border rounded-2xl shadow-md">
          <Avatar className="h-20 w-20">
            <AvatarImage alt={supplier.name} />
            <AvatarFallback>{supplier.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{supplier.name}</h1>
            <Badge variant="default">
              {supplier.name ? (
                <CheckCircle className="h-4 w-4 mr-1 inline" />
              ) : (
                <XCircle className="h-4 w-4 mr-1 inline" />
              )}
              Active
            </Badge>
          </div>
        </div>

        {/* Supplier Details */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <p>
              <strong>Name:</strong> {supplier.contactName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {supplier.contactEmail || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <ContactButton phoneNumber={supplier.contactPhone} />
            </p>
            <p>
              <strong>Bank Account:</strong> {supplier.bankAccount || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {supplier.address || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong> {formattedCreatedAt}
            </p>
            <p>
              <strong>Updated At:</strong> {formattedUpdatedAt}
            </p>
            <p>
              <strong>Last Login:</strong> {formattedLastLogin}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SupplierOverview supplierId={supplier.id}/>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable supplierId={supplierId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDetailContainer;
