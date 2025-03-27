"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { CommissionRateFormData } from "@/types/commissionRate";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

const formSchema = z.object({
  tenantId: z.coerce.number(),
  rate: z.coerce.number().min(0),
});

export function CommissionRateForm() {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : null;
  const { data, error, mutate } = useSWR(
    "/commission-rates/common-rate?tenantId=" + tenantId,
    fetcher,
  );

  if (error) toast.error("Fail to fetch commission rates.");

  const initialValues = data?.data || {
    tenantId: tenantId,
    supplierId: null,
    rate: 0,
  };

  const [prevValues, setPrevValues] = useState(initialValues);

  const form = useForm<CommissionRateFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (data?.data) {
      form.reset(data.data);
      setPrevValues(data.data);
    }
  }, [data?.data, form]);

  const { trigger } = useSWRMutation(
    "/commission-rates",
    async (url, { arg }: { arg: CommissionRateFormData }) => {
      return await axiosInstance.post<CommissionRateFormData>(url, arg);
    },
  );

  const handleSubmit = async (values: CommissionRateFormData) => {
    if (values.rate === prevValues.rate) {
      toast.info("No changes detected. Nothing to save.");
      return;
    }

    try {
      await trigger(values);
      toast.success("Commission Rate saved successfully!");

      await mutate();
      setPrevValues(values);
      form.reset(values);
    } catch {
      toast.error("Failed to save commission rate.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Rate (%)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Buy Rate */}
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate (%)</FormLabel>
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
      </CardContent>
    </Card>
  );
}
