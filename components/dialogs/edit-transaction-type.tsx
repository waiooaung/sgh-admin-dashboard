"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { toast } from "sonner";
import {
  TransactionType,
  TransactionTypeFormData,
} from "@/types/transactionType";

interface Props {
  open: boolean;
  onClose: () => void;
  transactionType: TransactionType;
  onSave: () => void;
}

// Zod Schema
const formSchema = z.object({
  tenantId: z.coerce.number(),
  name: z.string().min(3, "Name must be at least 2 characters"),
});

const EditTransactionType: React.FC<Props> = ({
  open,
  onClose,
  transactionType,
  onSave,
}) => {
  const form = useForm<TransactionTypeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: transactionType.tenantId,
      name: transactionType.name,
    },
  });

  useEffect(() => {
    if (open && transactionType) {
      form.reset(transactionType);
    }
  }, [open, transactionType, form]);

  const { trigger } = useSWRMutation(
    `/transaction-types/${transactionType.id}`,
    async (url: string, { arg }: { arg: TransactionTypeFormData }) => {
      return await axiosInstance.patch<TransactionTypeFormData>(url, arg);
    },
  );

  const handleSubmit = async (values: TransactionTypeFormData) => {
    const updatedAgentData = {
      ...values,
      id: transactionType.id,
    };
    try {
      await trigger(updatedAgentData);
      toast.success("Transaction type updated successfully!");
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction type!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
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

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionType;
