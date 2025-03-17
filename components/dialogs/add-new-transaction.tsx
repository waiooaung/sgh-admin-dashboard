"use client";
import React, { useState, useMemo, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import fetcher from "@/lib/fetcher";
import axiosInstance from "@/lib/axios-instance";
import { TransactionFormData } from "@/types/transaction";
import { toast } from "sonner";
import { Agent } from "@/types/agent";
import { Supplier } from "@/types/supplier";
import { MetaData } from "@/types/meta-data";

interface AddNewTransactionProps {
  onSuccess: () => void;
}

interface AgentApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Agent[];
  meta: MetaData;
  overview: null;
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
  transactionDate: z.date(),
  amountRMB: z.coerce.number(),
  buyRate: z.coerce.number(),
  sellRate: z.coerce.number(),
  commissionRate: z.coerce.number(),
  agentId: z.coerce.number(),
  supplierId: z.coerce.number(),
});

export function AddNewTransaction({ onSuccess }: AddNewTransactionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: exchangeRateData, error: exchangeRateError } = useSWR(
    "/exchange-rates/latest",
    fetcher,
  );

  if (exchangeRateError) toast.error(exchangeRateError);

  const exchangeRates = useMemo(() => {
    return (
      exchangeRateData?.data || {
        baseCurrency: "USD",
        quoteCurrency: "RMB",
        buyRate: 0,
        sellRate: 0,
      }
    );
  }, [exchangeRateData]);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(
      () => ({
        transactionDate: new Date(),
        amountRMB: 0,
        buyRate: exchangeRates.buyRate,
        sellRate: exchangeRates.sellRate,
        commissionRate: 0.3,
        agentId: undefined,
        supplierId: undefined,
      }),
      [exchangeRates],
    ),
  });

  const { amountRMB, buyRate, sellRate, commissionRate } = form.watch();
  const { amountUSDBuy, amountUSDSell, commission, profit, totalEarningsUSD } =
    useMemo(() => {
      const buyUSD = buyRate > 0 ? amountRMB / buyRate : 0;
      const sellUSD = sellRate > 0 ? amountRMB / sellRate : 0;
      const commissionValue = sellUSD * commissionRate;
      const profitValue = sellUSD > 0 && buyUSD > 0 ? sellUSD - buyUSD : 0;
      const totalEarnings = profitValue + commissionValue;

      return {
        amountUSDBuy: buyUSD,
        amountUSDSell: sellUSD,
        commission: commissionValue,
        profit: profitValue,
        totalEarningsUSD: totalEarnings,
      };
    }, [amountRMB, buyRate, sellRate, commissionRate]);

  const { trigger } = useSWRMutation(
    `/transactions`,
    async (url, { arg }: { arg: TransactionFormData }) => {
      return await axiosInstance.post<TransactionFormData>(url, arg);
    },
  );

  const {
    data: agentData,
    isLoading: isLoadingAgentData,
    error: agentDataError,
  } = useSWR<AgentApiResponse>(`/agents?limit=100`, fetcher);

  if (agentDataError) toast.error("Error fetching agents: " + agentDataError);
  const agents: Agent[] = agentData?.data || [];

  const {
    data: supplierData,
    isLoading: isLoadingSupplierData,
    error: supplierDataError,
  } = useSWR<SupplierApiResponse>(`/suppliers?limit=100`, fetcher);

  if (supplierDataError)
    toast.error("Error fetching suppliers: " + supplierDataError);
  const suppliers: Supplier[] = supplierData?.data || [];

  const handleSubmit = async (values: TransactionFormData) => {
    try {
      await trigger(values);
      toast.success("Transaction added successfully!");
      onSuccess();
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create transaction!");
    }
  };

  useEffect(() => {
    if (isOpen) {
      form.reset({
        ...form.getValues(),
        buyRate: exchangeRates.buyRate,
        sellRate: exchangeRates.sellRate,
      });
    }
  }, [exchangeRates, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calculated Results</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Amount USD (Buy)</span>
                <span>$ {amountUSDBuy.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Amount USD (Sell)</span>
                <span>$ {amountUSDSell.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Commission</span>
                <span>$ {commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Profit</span>
                <span>$ {profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total Earnings</span>
                <span>$ {totalEarningsUSD.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Amount RMB */}
              <FormField
                control={form.control}
                name="amountRMB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (RMB)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Buy Rate */}
              <FormField
                control={form.control}
                name="buyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy Rate</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Sell Rate */}
              <FormField
                control={form.control}
                name="sellRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sell Rate</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Commission Rate */}
              <FormField
                control={form.control}
                name="commissionRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Rate</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Agent */}
              <FormField
                control={form.control}
                name="agentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingAgentData ? (
                          <h1>Loading...</h1>
                        ) : agents.length > 0 ? (
                          agents.map((agents) => (
                            <SelectItem
                              key={agents.id}
                              value={agents.id.toString()}
                            >
                              {agents.name}
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
