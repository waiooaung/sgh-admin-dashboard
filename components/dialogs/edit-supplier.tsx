"use client";

import { useEffect, useState } from "react";
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
import { CreateSupplier, UpdateSupplier } from "@/types/supplier";
import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { toast } from "sonner";

interface EditSupplierProps {
  open: boolean;
  onClose: () => void;
  supplier: UpdateSupplier;
  onSave: () => void;
}

// Zod Schema
const formSchema = z.object({
  id: z.number().optional(),
  tenantId: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(2, "Phone must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  bankAccount: z
    .string()
    .min(10, "Bank account must be at least 10 characters"),
});

const EditSupplier: React.FC<EditSupplierProps> = ({
  open,
  onClose,
  supplier,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<CreateSupplier>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: supplier.tenantId,
      name: supplier.name,
      contactName: supplier.contactName,
      contactEmail: supplier.contactEmail,
      contactPhone: supplier.contactPhone,
      address: supplier.address,
      bankAccount: supplier.bankAccount,
    },
  });

  useEffect(() => {
    if (open && supplier) {
      form.reset(supplier);
    }
  }, [open, supplier, form]);

  const { trigger } = useSWRMutation(
    `/suppliers/${supplier.id}`,
    async (url: string, { arg }: { arg: UpdateSupplier }) => {
      return await axiosInstance.put<UpdateSupplier>(url, arg);
    },
  );

  const handleSubmit = async (values: CreateSupplier) => {
    const updatedSupplierData = {
      ...values,
      id: supplier.id,
    };
    try {
      setLoading(true);
      await trigger(updatedSupplierData);
      toast.success("Supplier updated successfully!");
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update supplier!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
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

            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account</FormLabel>
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
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}{" "}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSupplier;
