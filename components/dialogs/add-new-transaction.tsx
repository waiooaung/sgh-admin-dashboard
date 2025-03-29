"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
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
  baseAmount: z.coerce.number(),
  buyRate: z.coerce.number(),
  sellRate: z.coerce.number(),
  commissionRate: z.coerce.number(),
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
  profitDisplayCurrencies,
  tenantId,
}: AddNewTransactionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: exchangeRateData, error: exchangeRateError } = useSWR(
    "/exchange-rates/latest?tenantId=" + tenantId,
    fetcher,
  );

  if (exchangeRateError) toast.error("Exchange rate error.");

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

  const { data: commissionRateData, error: commissionRateError } = useSWR(
    "/commission-rates/common-rate?tenantId=" + tenantId,
    fetcher,
  );
  if (commissionRateError) toast.error("Commission rate error.");
  const commissionRates = useMemo(() => {
    return (
      commissionRateData?.data || {
        supplierId: null,
        rate: 0,
      }
    );
  }, [commissionRateData]);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(
      () => ({
        tenantId,
        baseCurrencyId: undefined,
        quoteCurrencyId: undefined,
        transactionDate: new Date(),
        baseAmount: 0,
        buyRate: exchangeRates.buyRate,
        sellRate: exchangeRates.sellRate,
        commissionRate: commissionRates.rate,
        transactionTypeId: undefined,
        agentId: undefined,
        supplierId: undefined,
        profits: profitDisplayCurrencies.map((profit) => ({
          currencyId: profit.currencyId,
          rate: 0,
        })),
      }),
      [tenantId, exchangeRates, commissionRates, profitDisplayCurrencies],
    ),
  });

  const { reset } = form;

  useEffect(() => {
    reset({
      tenantId,
      baseCurrencyId: undefined,
      quoteCurrencyId: undefined,
      transactionDate: new Date(),
      baseAmount: 0,
      buyRate: exchangeRates.buyRate,
      sellRate: exchangeRates.sellRate,
      commissionRate: commissionRates.rate,
      transactionTypeId: undefined,
      agentId: undefined,
      supplierId: undefined,
      profits: profitDisplayCurrencies.map((profit) => ({
        currencyId: profit.currencyId,
        rate: 0,
      })),
    });
  }, [
    tenantId,
    exchangeRates,
    commissionRates,
    profitDisplayCurrencies,
    reset,
  ]);

  const { fields } = useFieldArray({
    control: form.control,
    name: "profits",
  });

  const { baseAmount, buyRate, sellRate, commissionRate } = form.watch();
  const profits = useWatch({
    control: form.control,
    name: "profits",
    defaultValue: [],
  }); // Ensures stable reference

  const {
    quoteAmountBuy,
    quoteAmountSell,
    commission,
    profit,
    totalEarnings,
    profitData,
  } = useMemo(() => {
    const quoteAmountBuy = buyRate > 0 ? baseAmount * buyRate : 0;
    const quoteAmountSell = sellRate > 0 ? baseAmount * sellRate : 0;
    const commissionValue = quoteAmountSell * (commissionRate / 100);
    const profitValue =
      quoteAmountSell > 0 && quoteAmountBuy > 0
        ? quoteAmountSell - quoteAmountBuy
        : 0;
    const totalEarnings = profitValue + commissionValue;

    const profitData = profits.map((profit) => {
      const currency = profitDisplayCurrencies.find(
        (c) => c.currencyId === profit.currencyId,
      );

      return {
        currencyId: profit.currencyId,
        currencyName: currency ? currency.Currency.name : "Unknown",
        currencySymbol: currency ? currency.Currency.symbol : "",
        amount: totalEarnings * profit.rate,
      };
    });

    return {
      quoteAmountBuy,
      quoteAmountSell,
      commission: commissionValue,
      profit: profitValue,
      totalEarnings,
      profitData,
    };
  }, [
    baseAmount,
    buyRate,
    sellRate,
    commissionRate,
    profits, // Now stable
    profitDisplayCurrencies,
  ]);

  const { trigger } = useSWRMutation(
    `/transactions`,
    async (url, { arg }: { arg: TransactionFormData }) => {
      return await axiosInstance.post<TransactionFormData>(url, arg);
    },
  );

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
        commissionRate: commissionRates.rate,
      });
    }
  }, [exchangeRates, commissionRates, isOpen, form]);

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
                <span>{quoteAmountBuy.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Amount To (Sell)</span>
                <span>{quoteAmountSell.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Commission</span>
                <span>{commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Profit</span>
                <span>{profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total Earnings</span>
                <span>{totalEarnings.toFixed(2)}</span>
              </div>
              {profitData.map((data) => {
                return (
                  <div
                    key={data.currencyId}
                    className="flex justify-between text-xl font-bold"
                  >
                    <span>
                      Profit In {data.currencyName} ({data.currencySymbol})
                    </span>
                    <span>{data.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Base Currency */}
              <FormField
                control={form.control}
                name="baseCurrencyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency ( From )</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Currency from..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.length > 0 ? (
                          currencies.map((currency) => (
                            <SelectItem
                              key={currency.id}
                              value={currency.id.toString()}
                            >
                              {currency.name} ({currency.symbol})
                            </SelectItem>
                          ))
                        ) : (
                          <h1>Data not found.</h1>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quote Currency */}
              <FormField
                control={form.control}
                name="quoteCurrencyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency (To)</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Currency To..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.length > 0 ? (
                          currencies.map((currency) => (
                            <SelectItem
                              key={currency.id}
                              value={currency.id.toString()}
                            >
                              {currency.name} ({currency.symbol})
                            </SelectItem>
                          ))
                        ) : (
                          <h1>Data not found.</h1>
                        )}
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
                    <FormLabel>Amount</FormLabel>
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

              {/* Transaction Type */}
              <FormField
                control={form.control}
                name="transactionTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Transaction Type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transactionTypes.length > 0 ? (
                          transactionTypes.map((transactionType) => (
                            <SelectItem
                              key={transactionType.id}
                              value={transactionType.id.toString()}
                            >
                              {transactionType.name}
                            </SelectItem>
                          ))
                        ) : (
                          <h1>Data not found.</h1>
                        )}
                      </SelectContent>
                    </Select>
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

              <label className="font-semibold">Profit Rates</label>
              {fields.map((field, index) => {
                const currency = profitDisplayCurrencies.find(
                  (profit) =>
                    profit.Currency.id ===
                    form.watch(`profits.${index}.currencyId`),
                );

                return (
                  <div key={field.id} className="flex gap-2 items-center">
                    {/* Currency Display (Single Line) */}
                    <span className="font-medium whitespace-nowrap">
                      {currency
                        ? `${currency.Currency.name} (${currency.Currency.symbol})`
                        : "N/A"}
                    </span>

                    {/* Rate Input (Read-Only) */}
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Rate"
                      {...form.register(`profits.${index}.rate`)}
                    />
                  </div>
                );
              })}

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
