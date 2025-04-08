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

import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { TransactionFormData } from "@/types/transaction";
import { toast } from "sonner";
import { Agent } from "@/types/agent";
import { Supplier } from "@/types/supplier";
import { Currency } from "@/types/currency";
import { ProfitDisplayCurrency } from "@/types/profitDisplayCurrency";
import { TransactionType } from "@/types/transactionType";

interface AddNewTransactionProps {
  onSuccess: () => void;
  agents: Agent[];
  suppliers: Supplier[];
  transactionTypes: TransactionType[];
  currencies: Currency[];
  profitDisplayCurrencies: ProfitDisplayCurrency[];
  tenantId: number | undefined;
}

const profitSchema = z.object({
  currencyId: z.coerce.number(),
  rate: z.coerce.number(),
});

// Zod Schema
const formSchema = z.object({
  tenantId: z.coerce.number(),
  baseCurrencyId: z.coerce.number(),
  quoteCurrencyId: z.coerce.number(),
  transactionDate: z.date(),
  baseAmount: z.coerce.number().gt(0, "Amount must be greater than 0"),
  buyRate: z.coerce.number().gt(0, "Buy rate must be greater than 0"),
  sellRate: z.coerce.number().gt(0, "Sell rate must be greater than 0"),
  commissionRate: z.coerce.number().min(0, "Cannot be negative"),
  transactionType: z.string(),
  transactionTypeId: z.coerce.number(),
  agentId: z.coerce.number(),
  supplierId: z.coerce.number(),
  profits: z.array(profitSchema),
});

export function AddNewTransaction({
  onSuccess,
  agents,
  suppliers,
  transactionTypes,
  currencies,
  tenantId,
}: AddNewTransactionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState<Currency | undefined>(
    undefined,
  );
  const [quoteCurrency, setQuoteCurrency] = useState<Currency | undefined>(
    undefined,
  );

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId,
      baseCurrencyId: undefined,
      quoteCurrencyId: undefined,
      transactionDate: new Date(),
      baseAmount: undefined,
      buyRate: undefined,
      sellRate: undefined,
      commissionRate: 0,
      transactionType: "RMB",
      transactionTypeId: undefined,
      agentId: undefined,
      supplierId: undefined,
      profits: [],
    },
  });

  const { transactionType, baseAmount, buyRate, sellRate, commissionRate } =
    form.watch();

  useEffect(() => {
    if (currencies.length === 0) return;

    let newBase: Currency | undefined;
    let newQuote: Currency | undefined;

    if (transactionType === "RMB") {
      newBase = currencies.find((c) => c.name === "RMB");
      newQuote = currencies.find((c) => c.name === "USD");

      const usd = currencies.find((c) => c.name === "USD");
      const aed = currencies.find((c) => c.name === "AED");

      const newProfits = [
        {
          currencyId: usd?.id ?? 0,
          rate: 1,
        },
        {
          currencyId: aed?.id ?? 0,
          rate: 3.67,
        },
      ];
      form.setValue("baseCurrencyId", newBase?.id ?? 0);
      form.setValue("quoteCurrencyId", newQuote?.id ?? 0);
      form.setValue("profits", newProfits);
    } else if (transactionType === "USDT") {
      newBase = currencies.find((c) => c.name === "USDT");
      newQuote = currencies.find((c) => c.name === "AED");

      const usd = currencies.find((c) => c.name === "USD");
      const aed = currencies.find((c) => c.name === "AED");

      const newProfits = [
        {
          currencyId: usd?.id ?? 0,
          rate: 0.27,
        },
        {
          currencyId: aed?.id ?? 0,
          rate: 1,
        },
      ];
      form.setValue("profits", newProfits);
      form.setValue("baseCurrencyId", newBase?.id ?? 0);
      form.setValue("quoteCurrencyId", newQuote?.id ?? 0);
    }

    const selectedType = transactionTypes.find(
      (type) => type.name === transactionType,
    );
    form.setValue("transactionTypeId", selectedType?.id ?? 0);

    setBaseCurrency(newBase);
    setQuoteCurrency(newQuote);
  }, [transactionType, currencies, form, transactionTypes]);

  const { quoteAmountBuy, quoteAmountSell, commission, profit, totalEarnings } =
    useMemo(() => {
      let quoteAmountBuy = 0;
      let quoteAmountSell = 0;
      let commissionValue = 0;
      let profitValue = 0;
      let totalEarnings = 0;

      if (transactionType === "RMB") {
        quoteAmountBuy = buyRate > 0 ? baseAmount / buyRate : 0;
        quoteAmountSell = sellRate > 0 ? baseAmount / sellRate : 0;
      } else if (transactionType === "USDT") {
        quoteAmountBuy = buyRate > 0 ? baseAmount * buyRate : 0;
        quoteAmountSell = sellRate > 0 ? baseAmount * sellRate : 0;
      }

      commissionValue = quoteAmountSell * (commissionRate / 100);
      profitValue =
        quoteAmountSell > 0 && quoteAmountBuy > 0
          ? quoteAmountSell - quoteAmountBuy
          : 0;
      totalEarnings = profitValue + commissionValue;

      return {
        quoteAmountBuy,
        quoteAmountSell,
        commission: commissionValue,
        profit: profitValue,
        totalEarnings,
      };
    }, [transactionType, baseAmount, buyRate, sellRate, commissionRate]);

  const { trigger } = useSWRMutation(
    `/transactions`,
    async (url, { arg }: { arg: TransactionFormData }) => {
      return await axiosInstance.post<TransactionFormData>(url, arg);
    },
  );

  const handleSubmit = async (values: TransactionFormData) => {
    try {
      setLoading(true);
      await trigger(values);
      toast.success("Transaction added successfully!");
      onSuccess();
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create transaction!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currencies.length > 0) {
      const defaultBase = currencies.find((c) => c.name === "RMB");
      const defaultQuote = currencies.find((c) => c.name === "USD");

      setBaseCurrency(defaultBase);
      setQuoteCurrency(defaultQuote);

      form.reset({
        tenantId,
        baseCurrencyId: defaultBase?.id ?? 0,
        quoteCurrencyId: defaultQuote?.id ?? 0,
        transactionDate: new Date(),
        baseAmount: 0,
        buyRate: 0,
        sellRate: 0,
        commissionRate: 0,
        transactionType: "RMB",
        transactionTypeId:
          transactionTypes.find((t) => t.name === "RMB")?.id ?? 0,
        agentId: undefined,
        supplierId: undefined,
        profits: [
          {
            currencyId: currencies.find((c) => c.name === "USD")?.id ?? 0,
            rate: 1,
          },
          {
            currencyId: currencies.find((c) => c.name === "AED")?.id ?? 0,
            rate: 3.67,
          },
        ],
      });
    }
  }, [isOpen, tenantId, currencies, form, transactionTypes]);

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
                <span className="font-semibold">Amount To (Buy)</span>
                <span>
                  {quoteCurrency?.symbol} {quoteAmountBuy.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Amount To (Sell)</span>
                <span>
                  {quoteCurrency?.symbol} {quoteAmountSell.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Commission Profit</span>
                <span>
                  {quoteCurrency?.symbol} {commission.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Exchange Profit</span>
                <span>
                  {quoteCurrency?.symbol} {profit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total Earnings</span>
                <span>
                  {quoteCurrency?.symbol} {totalEarnings.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Transaction Type */}
              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Transaction Type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RMB">RMB</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount RMB */}
              <FormField
                control={form.control}
                name="baseAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ({baseCurrency?.symbol})</FormLabel>
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
                    <FormLabel>Commission Rate (%)</FormLabel>
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
                        {agents.length > 0 ? (
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
                        {suppliers.length > 0 ? (
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
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}{" "}
                  {/* Button text based on loading */}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
