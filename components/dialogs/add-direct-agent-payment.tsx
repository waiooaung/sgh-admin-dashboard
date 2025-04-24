"use client";
import React, { useState, useEffect } from "react";
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

import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import {
  AgentPaymentFormData,
  DirectAgentPaymentFormData,
} from "@/types/agentPayment";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useAgents } from "@/hooks/useAgents";
import { useCurrencies } from "@/hooks/useCurrencies";
import { Transaction } from "@/types/transaction";
import AgentBalances from "../overviews/agent-balances";

interface Props {
  transaction: Transaction;
  onSuccess: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

// Zod Schema
const formSchema = z.object({
  tenantId: z.coerce.number(),
  transactionId: z.coerce.number(),
  agentId: z.coerce.number(),
  currencyId: z.coerce.number(),
  amountPaid: z.coerce.number(),
  transactionCurrencyId: z.coerce.number(),
  exchangeRate: z.coerce.number(),
  paymentType: z.string().min(5),
});

export function AddDirectAgentPayment({
  transaction,
  onSuccess,
  isOpen,
  setIsOpen,
}: Props) {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;
  const [loading, setLoading] = useState(false);
  const transactionId = transaction.id;
  const defaultAgent = transaction.Agent;
  const defaultCurrency = transaction.quoteCurrency;
  const defaultAmount = transaction.quoteAmountSell;
  const transactionCurrencies = [
    transaction.baseCurrency,
    transaction.quoteCurrency,
  ];

  const form = useForm<DirectAgentPaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId,
      transactionId: transactionId,
      agentId: defaultAgent.id,
      currencyId: defaultCurrency.id,
      amountPaid: defaultAmount,
      transactionCurrencyId: undefined,
      exchangeRate: undefined,
      paymentType: "",
    },
  });

  const { trigger } = useSWRMutation(
    `/agent-payments`,
    async (url, { arg }: { arg: AgentPaymentFormData }) => {
      return await axiosInstance.post<AgentPaymentFormData>(url, arg);
    },
  );

  const { agents } = useAgents(tenantId);
  const { currencies } = useCurrencies(tenantId);

  const handleSubmit = async (values: AgentPaymentFormData) => {
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

  useEffect(() => {
    form.reset({
      tenantId,
      transactionId,
      agentId: transaction.Agent?.id,
      currencyId: transaction.quoteCurrency.id,
      amountPaid: transaction.quoteAmountSell,
      transactionCurrencyId: undefined,
      paymentType: "",
    });
  }, [transaction, tenantId, form, transactionId]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply Payment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-1">
          <AgentBalances agentId={defaultAgent.id} />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Agent */}
              {!defaultAgent && (
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
                          {agents.length > 0 &&
                            agents.map((agent) => (
                              <SelectItem
                                key={agent.id}
                                value={agent.id.toString()}
                              >
                                {agent.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Currency Id */}
              <FormField
                control={form.control}
                name="currencyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
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
                              {currency.name} ({currency.symbol})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Paid Amount */}
              <FormField
                control={form.control}
                name="amountPaid"
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

              {/* Currency Id */}
              <FormField
                control={form.control}
                name="transactionCurrencyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transactionCurrencies.length > 0 &&
                          transactionCurrencies.map((currency) => (
                            <SelectItem
                              key={currency.id}
                              value={currency.id.toString()}
                            >
                              {currency.name} ({currency.symbol})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Exchange Rate */}
              <FormField
                control={form.control}
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange Rate</FormLabel>
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
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
