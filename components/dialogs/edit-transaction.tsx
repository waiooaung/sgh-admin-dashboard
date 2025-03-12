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
import { TransactionFormData } from "@/types/transaction";
import { toast } from "sonner";
import { Agent } from "@/types/agent";
import { Supplier } from "@/types/supplier";
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

const formSchema = z.object({
  transactionDate: z.date(),
  amountRMB: z.coerce.number(),
  buyRate: z.coerce.number(),
  sellRate: z.coerce.number(),
  commissionRate: z.coerce.number(),
  agentId: z.coerce.number(),
  supplierId: z.coerce.number(),
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
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    transaction,
  );

  useEffect(() => {
    if (open && transaction) {
      setEditTransaction(transaction);
    }
  }, [open, transaction]);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDate: editTransaction?.transactionDate
        ? new Date(editTransaction.transactionDate)
        : undefined,
      amountRMB: editTransaction?.amountRMB || 0,
      buyRate: editTransaction?.buyRate || 0,
      sellRate: editTransaction?.sellRate || 0,
      commissionRate: editTransaction?.commissionRate || 0,
      agentId: editTransaction?.agentId || 0,
      supplierId: editTransaction?.supplierId || 0,
    },
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
    `/transactions/${editTransaction?.id}`,
    async (url: string, { arg }: { arg: TransactionFormData }) => {
      return await axiosInstance.put<Transaction>(url, arg);
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
      toast.success("Transaction updated successfully!");
      onSave();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create transaction!");
    }
  };

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
                <span className="font-semibold">Amount USD (Buy)</span>
                <span>{amountUSDBuy.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Amount USD (Sell)</span>
                <span>{amountUSDSell.toFixed(2)}</span>
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
                <span>{totalEarningsUSD.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
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
                <Button variant="outline" onClick={onClose}>
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
