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

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import fetcher from "@/lib/fetcher";
import axiosInstance from "@/lib/axios-instance";
import { SupplierPaymentFormData } from "@/types/supplierPayment";
import { toast } from "sonner";
import { Supplier } from "@/types/supplier";
import { MetaData } from "@/types/meta-data";

interface AddSupplierPaymentProps {
  onSuccess: () => void;
}

interface SupplierApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Supplier[];
  meta: MetaData;
  overview: null;
}

// Zod Schema
const formSchema = z.object({
  supplierId: z.coerce.number(),
  amountPaidUSD: z.coerce.number(),
  paymentType: z.string().min(5),
});

export function AddSupplierPayment({ onSuccess }: AddSupplierPaymentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SupplierPaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: undefined,
      amountPaidUSD: 0,
      paymentType: "",
    },
  });

  const { trigger } = useSWRMutation(
    `/supplier-payments`,
    async (url, { arg }: { arg: SupplierPaymentFormData }) => {
      return await axiosInstance.post<SupplierPaymentFormData>(url, arg);
    },
  );

  const {
    data: supplierData,
    isLoading: isLoadingSupplierData,
    error: supplierDataError,
  } = useSWR<SupplierApiResponse>(`/suppliers?limit=100`, fetcher);

  if (supplierDataError)
    toast.error("Error fetching suppliers: " + supplierDataError);
  const suppliers: Supplier[] = supplierData?.data || [];

  const handleSubmit = async (values: SupplierPaymentFormData) => {
    try {
      await trigger(values);
      toast.success("Payment added successfully!");
      onSuccess();
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create payment!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Supplier */}
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
                        {isLoadingSupplierData ? (
                          <h1>Loading...</h1>
                        ) : suppliers.length > 0 ? (
                          suppliers.map((suppliers) => (
                            <SelectItem
                              key={suppliers.id}
                              value={suppliers.id.toString()}
                            >
                              {suppliers.name}
                            </SelectItem>
                          ))
                        ) : (
                          <h1>No suppliers found</h1>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Commission Rate */}
              <FormField
                control={form.control}
                name="amountPaidUSD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Amount ( USD )</FormLabel>
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
                    <FormLabel>Payment Type</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
