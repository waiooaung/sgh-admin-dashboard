"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { CreateSupplier } from "@/types/supplier";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

interface AddNewSupplierProps {
  onSuccess: () => void;
}

const formSchema = z.object({
  tenantId: z.coerce.number(),
  name: z.string().min(2).max(20),
  contactName: z.string().min(2).max(20),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(2).max(20),
  address: z.string().min(10).max(255),
  bankAccount: z.string().min(10).max(50),
});

export function AddNewSupplier({ onSuccess }: AddNewSupplierProps) {
  const { user } = useAuth();
  const tenantId = user?.tenantId || undefined;
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateSupplier>({
    resolver: zodResolver(formSchema), // Add resolver here
    defaultValues: {
      tenantId,
      name: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      bankAccount: "",
    },
  });

  const { trigger } = useSWRMutation(
    `/suppliers`,
    async (url: string, { arg }: { arg: CreateSupplier }) => {
      return await axiosInstance.post<CreateSupplier>(url, arg);
    },
  );

  const handleSubmit = async (values: CreateSupplier) => {
    try {
      await trigger(values);
      toast.success("Supplier created successfully!");
      form.reset();
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create supplier!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Supplier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Name */}
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

            {/* Contact Name */}
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

            {/* Contact Email */}
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

            {/* Contact Phone */}
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

            {/* Address */}
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

            {/* Bank Account */}
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

            {/* Submit Button */}
            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
