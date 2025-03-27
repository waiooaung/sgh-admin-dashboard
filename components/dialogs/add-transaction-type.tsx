"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TransactionTypeFormData } from "@/types/transactionType";
import { useAuth } from "@/context/authContext";
import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { toast } from "sonner";

const formSchema = z.object({
  tenantId: z.coerce.number(),
  name: z.string().min(3),
});

interface Props {
  onSuccess: () => void;
}

export function AddTransactionType({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;

  const initialValues = {
    tenantId: tenantId,
    name: "",
  };

  const form = useForm<TransactionTypeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { trigger } = useSWRMutation(
    "/transaction-types",
    async (url: string, { arg }: { arg: TransactionTypeFormData }) => {
      return await axiosInstance.post<TransactionTypeFormData>(url, arg);
    },
  );

  const handleSubmit = async (values: TransactionTypeFormData) => {
    try {
      await trigger(values);
      toast.success("Transaction type saved successfully!");
      onSuccess();
      form.reset(initialValues);
      setIsOpen(false);
    } catch {
      toast.error("Failed to save transaction type.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction Type</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Transaction Type</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
