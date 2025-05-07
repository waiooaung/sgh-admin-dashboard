"use client";
import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { mutate } from "swr";

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
  const defaultAmount = transaction.remainingAmountFromAgent;

  const form = useForm<DirectAgentPaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId,
      transactionId: transactionId,
      agentId: defaultAgent.id,
      currencyId: defaultCurrency.id,
      amountPaid: defaultAmount,
      exchangeRate: undefined,
      paymentType: "",
    },
  });

  const selectedCurrency = useWatch({
    control: form.control,
    name: "currencyId",
  });

  const { trigger } = useSWRMutation(
    `/agent-payments/directPayment`,
    async (url, { arg }: { arg: AgentPaymentFormData }) => {
      return await axiosInstance.post<AgentPaymentFormData>(url, arg);
    },
  );

  const queryParams = new URLSearchParams();
  if (tenantId) {
    if (tenantId) queryParams.append("tenantId", tenantId.toString());
  }
  const { agents } = useAgents(queryParams);
  const { currencies } = useCurrencies(tenantId);

  const handleSubmit = async (values: AgentPaymentFormData) => {
    if (loading) return;
    try {
      setLoading(true);
      await trigger(values);
      toast.success("Payment added successfully!");
      onSuccess();
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/transactions"),
        undefined,
        { revalidate: true },
      );
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
      amountPaid: transaction.remainingAmountFromAgent,
      paymentType: "",
    });
  }, [transaction, tenantId, form, transactionId]);

  useEffect(() => {
    if (transaction.quoteCurrencyId === selectedCurrency) {
      form.setValue("exchangeRate", 1);
    }
  }, [selectedCurrency, transaction.quoteCurrencyId, form]);

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
          <DialogTitle>Apply Customer Payment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-1">
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

              {transaction.quoteCurrencyId !== Number(selectedCurrency) && (
                <FormField
                  control={form.control}
                  name="exchangeRate"
                  render={({ field }) => {
                    const baseCurrency = currencies.find(
                      (c) => c.id === transaction.quoteCurrencyId,
                    );
                    const selected = currencies.find(
                      (c) => c.id === Number(selectedCurrency),
                    );
                    return (
                      <FormItem>
                        <FormLabel>Exchange Rate</FormLabel>
                        {baseCurrency && selected && (
                          <small className="text-muted-foreground">
                            1 {selected.symbol} = {field.value || "?"}{" "}
                            {baseCurrency.symbol}
                          </small>
                        )}
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. 1 USD = 3.65 AED"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}

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
