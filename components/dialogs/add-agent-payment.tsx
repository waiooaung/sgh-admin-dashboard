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
import { AgentPaymentFormData } from "@/types/agentPayment";
import { toast } from "sonner";
import { Agent } from "@/types/agent";
import { MetaData } from "@/types/meta-data";
import { useAuth } from "@/context/authContext";

interface AddAgentPaymentProps {
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

// Zod Schema
const formSchema = z.object({
  tenantId: z.coerce.number(),
  agentId: z.coerce.number(),
  amountPaidUSD: z.coerce.number(),
  paymentType: z.string().min(5),
});

export function AddAgentPayment({ onSuccess }: AddAgentPaymentProps) {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<AgentPaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId,
      agentId: undefined,
      amountPaidUSD: 0,
      paymentType: "",
    },
  });

  const { trigger } = useSWRMutation(
    `/agent-payments`,
    async (url, { arg }: { arg: AgentPaymentFormData }) => {
      return await axiosInstance.post<AgentPaymentFormData>(url, arg);
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

  const handleSubmit = async (values: AgentPaymentFormData) => {
    if (loading) return;
    try {
      setLoading(true);
      await trigger(values);
      toast.success("Payment added successfully!");
      onSuccess();
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create payment!");
    } finally {
      setLoading(false);
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
