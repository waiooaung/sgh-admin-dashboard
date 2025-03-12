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
import { ExchangeRateFormData } from "@/types/exchangeRate";
import { toast } from "sonner";

const formSchema = z.object({
  baseCurrency: z.string().min(2).max(10),
  quoteCurrency: z.string().min(2).max(10),
  buyRate: z.coerce.number().min(0),
  sellRate: z.coerce.number().min(0),
});

export function ExchangeRateCard() {
  const {
    data: exchangeRateData,
    error: exchangeRateError,
    mutate,
  } = useSWR("/exchange-rates/latest", fetcher);

  if (exchangeRateError) toast.error(exchangeRateError);

  const initialValues = exchangeRateData?.data || {
    baseCurrency: "USD",
    quoteCurrency: "RMB",
    buyRate: 0,
    sellRate: 0,
  };

  const [prevValues, setPrevValues] = useState(initialValues);

  const form = useForm<ExchangeRateFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (exchangeRateData?.data) {
      form.reset(exchangeRateData.data);
      setPrevValues(exchangeRateData.data);
    }
  }, [exchangeRateData?.data, form]);

  const { trigger } = useSWRMutation(
    "/exchange-rates",
    async (url, { arg }: { arg: ExchangeRateFormData }) => {
      return await axiosInstance.post<ExchangeRateFormData>(url, arg);
    },
  );

  const handleSubmit = async (values: ExchangeRateFormData) => {
    if (
      values.buyRate === prevValues.buyRate &&
      values.sellRate === prevValues.sellRate
    ) {
      toast.info("No changes detected. Nothing to save.");
      return;
    }

    try {
      await trigger(values);
      toast.success("Exchange Rates saved successfully!");

      await mutate();
      setPrevValues(values);
      form.reset(values);
    } catch (error) {
      toast.error("Failed to save exchange rates, error: " + error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Exchange Rates{" "}
          <span>
            ({initialValues.baseCurrency}-{initialValues.quoteCurrency})
          </span>
        </CardTitle>
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
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
