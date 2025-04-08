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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ExchangeRateFormData } from "@/types/exchangeRate";
import { useAuth } from "@/context/authContext";
import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { toast } from "sonner";
import { useCurrencies } from "@/hooks/useCurrencies";

const formSchema = z.object({
  tenantId: z.coerce.number(),
  name: z.string().min(3),
  baseCurrencyId: z.coerce.number(),
  quoteCurrencyId: z.coerce.number(),
  buyRate: z.coerce.number(),
  sellRate: z.coerce.number(),
});

interface Props {
  onSuccess: () => void;
}

export function AddExchangeRate({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;

  const initialValues = {
    tenantId: tenantId,
    name: undefined,
    baseCurrencyId: undefined,
    quoteCurrencyId: undefined,
    buyRate: 0,
    sellRate: 0,
  };

  const form = useForm<ExchangeRateFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { trigger } = useSWRMutation(
    "/exchange-rates",
    async (url: string, { arg }: { arg: ExchangeRateFormData }) => {
      return await axiosInstance.post<ExchangeRateFormData>(url, arg);
    },
  );

  const { currencies } = useCurrencies(tenantId);

  const handleSubmit = async (values: ExchangeRateFormData) => {
    try {
      setLoading(true);
      await trigger(values);
      toast.success("Data created successfully!");
      onSuccess();
      form.reset(initialValues);
      setIsOpen(false);
    } catch {
      toast.error("Failed to create data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Exchange Rate</Button>
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
            <FormField
              control={form.control}
              name="baseCurrencyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency (From)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Base Currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem
                          key={currency.id}
                          value={currency.id?.toString()}
                        >
                          {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quoteCurrencyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency (To)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Quote Currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem
                          key={currency.id}
                          value={currency.id?.toString()}
                        >
                          {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}{" "}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
