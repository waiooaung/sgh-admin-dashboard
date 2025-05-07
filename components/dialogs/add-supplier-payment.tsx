"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";

import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { SupplierPaymentFormData } from "@/types/supplierPayment";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useCurrencies } from "@/hooks/useCurrencies";
import { Supplier } from "@/types/supplier";
import SupplierOwedOverview from "../overviews/supplier-owed-overview";
import SupplierTransactionTable from "../tables/supplier-transaction-table";

interface AddSupplierPaymentProps {
  defaultSupplier?: Supplier;
  onSuccess: () => void;
}

// Zod Schema
const formSchema = z.object({
  tenantId: z.coerce.number(),
  supplierId: z.coerce.number(),
  currencyId: z.coerce.number(),
  amountPaid: z.coerce.number(),
  paymentType: z.string().min(5),
});

export function AddSupplierPayment({
  defaultSupplier,
  onSuccess,
}: AddSupplierPaymentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;

  const form = useForm<SupplierPaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId,
      supplierId: defaultSupplier ? defaultSupplier.id : undefined,
      currencyId: undefined,
      amountPaid: 0,
      paymentType: "",
    },
  });

  const { trigger } = useSWRMutation(
    `/supplier-payments`,
    async (url, { arg }: { arg: SupplierPaymentFormData }) => {
      return await axiosInstance.post<SupplierPaymentFormData>(url, arg);
    },
  );

  const queryParams = new URLSearchParams();
  if (tenantId) {
    queryParams.append("tenantId", tenantId.toString());
  }
  const { suppliers } = useSuppliers(queryParams);
  const { currencies } = useCurrencies(tenantId);

  const handleSubmit = async (values: SupplierPaymentFormData) => {
    if (loading) return;

    try {
      setLoading(true);
      await trigger(values);
      toast.success("Payment added successfully!");
      onSuccess();
      form.reset();
      setIsOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Fail to create data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const supplierId = form.watch("supplierId");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-10/12 w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* Supplier */}
              {!defaultSupplier && (
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.length > 0 &&
                            suppliers.map((supplier) => (
                              <SelectItem
                                key={supplier.id}
                                value={supplier.id.toString()}
                              >
                                {supplier.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Currencies */}
              <FormField
                control={form.control}
                name="currencyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.length > 0 &&
                          currencies.map((currency) => (
                            <SelectItem
                              key={currency.id}
                              value={currency.id.toString()}
                            >
                              {currency.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Commission Rate */}
              <FormField
                control={form.control}
                name="amountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Amount</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Type */}
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Note</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none min-h-[40px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-end">
                <DialogFooter className="p-0">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>

          {tenantId && supplierId && (
            <SupplierOwedOverview tenantId={tenantId} supplierId={supplierId} />
          )}

          {tenantId && supplierId && (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Open Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <SupplierTransactionTable
                    defaultSupplierId={supplierId}
                    defaultSupplierPaymentStatus={["PARTIALLY_PAID", "PENDING"]}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
