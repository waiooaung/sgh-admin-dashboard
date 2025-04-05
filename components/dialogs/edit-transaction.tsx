"use client";
import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import fetcher from "@/lib/fetcher";
import axiosInstance from "@/lib/axios-instance";
import { profit, TransactionFormData } from "@/types/transaction";
import { toast } from "sonner";
import { Agent } from "@/types/agent";
import { Supplier } from "@/types/supplier";
import { Currency } from "@/types/currency";
import { MetaData } from "@/types/meta-data";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { TransactionType } from "@/types/transactionType";

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

interface TransactionTypeApiResponse {
  statusCode: number;
  success: boolean;
  data: TransactionType[];
}

interface CurrencyApiResponse {
  statusCode: number;
  success: boolean;
  data: Currency[];
}

const profitSchema = z.object({
  currencyId: z.coerce.number(),
  rate: z.coerce.number(),
});

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
  transactionType: z.string(),
  agentId: z.coerce.number(),
  supplierId: z.coerce.number(),
  profits: z.array(profitSchema),
});

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
  onSave: () => void;
}

const EditTransaction: React.FC<EditTransactionModalProps> = ({
  open,
  onClose,
  transaction,
  onSave,
}) => {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    transaction,
  );
  const [baseCurrency, setBaseCurrency] = useState<Currency | undefined>(
    undefined,
  );
  const [quoteCurrency, setQuoteCurrency] = useState<Currency | undefined>(
    undefined,
  );

  const { trigger } = useSWRMutation(
    `/transactions/${editTransaction?.id}`,
    async (url: string, { arg }: { arg: TransactionFormData }) => {
      return await axiosInstance.put<Transaction>(url, arg);
    },
  );

  const {
    data: agentData,
    isLoading: isLoadingAgentData,
    error: agentDataError,
  } = useSWR<AgentApiResponse>(
    `/agents?limit=100&tenantId=${tenantId}`,
    fetcher,
  );

  if (agentDataError) toast.error("Error fetching agents.");
  const agents: Agent[] = agentData?.data || [];

  const {
    data: supplierData,
    isLoading: isLoadingSupplierData,
    error: supplierDataError,
  } = useSWR<SupplierApiResponse>(
    `/suppliers?limit=100&tenantId=${tenantId}`,
    fetcher,
  );

  if (supplierDataError) toast.error("Error fetching suppliers.");
  const suppliers: Supplier[] = supplierData?.data || [];

  const { data: transactionTypeData, error: transactionTypeDataError } =
    useSWR<TransactionTypeApiResponse>(
      `/transaction-types?limit=100&tenantId=${tenantId}`,
      fetcher,
    );

  if (transactionTypeDataError)
    toast.error("Error fetching transaction types.");
  const transactionTypes = useMemo(
    () => transactionTypeData?.data || [],
    [transactionTypeData],
  );

  const { data: currenciesData, error: currenciesError } =
    useSWR<CurrencyApiResponse>(`/currencies?tenantId=${tenantId}`, fetcher);

  if (currenciesError) toast.error("Error fetching transaction types.");
  const currencies = useMemo(
    () => currenciesData?.data || [],
    [currenciesData],
  );

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: editTransaction?.tenantId,
      baseCurrencyId: editTransaction?.baseCurrencyId,
      quoteCurrencyId: editTransaction?.quoteCurrencyId,
      transactionTypeId: editTransaction?.transactionTypeId || undefined,
      transactionType:
        transactionTypes.find(
          (type) => type.id === editTransaction?.transactionTypeId,
        )?.name || "",
      transactionDate: editTransaction?.transactionDate
        ? new Date(editTransaction.transactionDate)
        : undefined,
      baseAmount: editTransaction?.baseAmount || 0,
      buyRate: editTransaction?.buyRate || 0,
      sellRate: editTransaction?.sellRate || 0,
      commissionRate: editTransaction?.commissionRate || 0,
      agentId: editTransaction?.agentId || 0,
      supplierId: editTransaction?.supplierId || 0,
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
      if (transactionType === "RMB") {
        quoteAmountBuy = buyRate > 0 ? baseAmount / buyRate : 0;
        quoteAmountSell = sellRate > 0 ? baseAmount / sellRate : 0;
      } else if (transactionType === "USDT") {
        quoteAmountBuy = buyRate > 0 ? baseAmount * buyRate : 0;
        quoteAmountSell = sellRate > 0 ? baseAmount * sellRate : 0;
      }

      const commissionValue = quoteAmountSell * (commissionRate / 100);
      const profitValue =
        quoteAmountSell > 0 && quoteAmountBuy > 0
          ? quoteAmountSell - quoteAmountBuy
          : 0;
      const totalEarnings = profitValue + commissionValue;

      return {
        quoteAmountBuy: quoteAmountBuy,
        quoteAmountSell: quoteAmountSell,
        commission: commissionValue,
        profit: profitValue,
        totalEarnings: totalEarnings,
      };
    }, [transactionType, baseAmount, buyRate, sellRate, commissionRate]);

  const handleSubmit = async (values: TransactionFormData) => {
    try {
      await trigger(values);
      toast.success("Transaction updated successfully!");
      onSave();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create transaction!");
    }
  };

  useEffect(() => {
    if (
      open &&
      transaction &&
      transactionTypes.length > 0 &&
      currencies.length > 0
    ) {
      const matchedType = transactionTypes.find(
        (type) => type.id === transaction.transactionTypeId,
      );
      let profits: profit[] = [];
      const usd = currencies.find((c) => c.name === "USD");
      const aed = currencies.find((c) => c.name === "AED");
      if (matchedType?.name === "RMB") {
        profits = [
          {
            currencyId: usd?.id ?? 0,
            rate: 1,
          },
          {
            currencyId: aed?.id ?? 0,
            rate: 3.67,
          },
        ];
      } else if (matchedType?.name === "USDT") {
        profits = [
          {
            currencyId: usd?.id ?? 0,
            rate: 0.27,
          },
          {
            currencyId: aed?.id ?? 0,
            rate: 1,
          },
        ];
      }
      setEditTransaction(transaction);
      form.reset({
        tenantId: transaction.tenantId,
        baseCurrencyId: transaction.baseCurrencyId,
        quoteCurrencyId: transaction.quoteCurrencyId,
        transactionTypeId: transaction.transactionTypeId || undefined,
        transactionType: matchedType?.name || "",
        transactionDate: transaction.transactionDate
          ? new Date(transaction.transactionDate)
          : undefined,
        baseAmount: transaction.baseAmount || 0,
        buyRate: transaction.buyRate || 0,
        sellRate: transaction.sellRate || 0,
        commissionRate: transaction.commissionRate || 0,
        agentId: transaction.agentId || 0,
        supplierId: transaction.supplierId || 0,
        profits: profits,
      });
      console.log(form.getValues());
    }
  }, [open, transaction, currencies, transactionTypes, form]);

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Transaction: #TNX-{editTransaction?.id}
          </DialogTitle>
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

              {/* Transaction Date */}
              <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransaction;
