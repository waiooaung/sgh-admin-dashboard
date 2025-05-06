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
import { AgentPaymentFormData } from "@/types/agentPayment";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useAgents } from "@/hooks/useAgents";
import { useCurrencies } from "@/hooks/useCurrencies";
import { Agent } from "@/types/agent";
import AgentOverview from "../overviews/agent-overview";
import AgentTransactionTable from "../tables/agent-transaction-table";

interface AddAgentPaymentProps {
  defaultAgent?: Agent;
  onSuccess: () => void;
}

// Zod Schema
const formSchema = z.object({
  tenantId: z.coerce.number(),
  agentId: z.coerce.number(),
  currencyId: z.coerce.number(),
  amountPaid: z.coerce.number(),
  paymentType: z.string().min(5),
});

export function AddAgentPayment({
  onSuccess,
  defaultAgent,
}: AddAgentPaymentProps) {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<AgentPaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId,
      agentId: defaultAgent ? defaultAgent.id : undefined,
      currencyId: undefined,
      amountPaid: 0,
      paymentType: "",
    },
  });

  const { trigger } = useSWRMutation(
    `/agent-payments`,
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

  const agentId = form.watch("agentId");

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
          {tenantId && agentId && (
            <AgentOverview tenantId={tenantId} agentId={agentId} />
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
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
                          {agents.map((agent) => (
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

              {/* Currency */}
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
                        {currencies.map((currency) => (
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

              {/* Amount Paid */}
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

              {/* Payment Note */}
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

              {/* Submit Button */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-end">
                <DialogFooter className="p-0">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>

          {tenantId && agentId && (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Open Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentTransactionTable
                    defaultAgentId={agentId}
                    defaultAgentPaymentStatus={["PARTIALLY_PAID", "PENDING"]}
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
