"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas-pro";
import { Separator } from "../ui/separator";
import { Eye } from "lucide-react";
import { useAuth } from "@/context/authContext";

const formSchema = z.object({
  tenantId: z.coerce.number(),
  baseCurrency: z.string().min(2).max(10),
  quoteCurrency: z.string().min(2).max(10),
  buyRate: z.coerce.number().min(0),
  sellRate: z.coerce.number().min(0),
});

export function ExchangeRateCard() {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : null;
  const {
    data: exchangeRateData,
    error: exchangeRateError,
    mutate,
  } = useSWR(`/exchange-rates/latest?tenantId=${tenantId}`, fetcher);

  if (exchangeRateError) toast.error("Fail to fetch exchange rates.");

  const initialValues = exchangeRateData?.data || {
    tenantId,
    baseCurrency: "USD",
    quoteCurrency: "RMB",
    buyRate: 0,
    sellRate: 0,
  };

  const [prevValues, setPrevValues] = useState(initialValues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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
    } catch {
      toast.error("Failed to save exchange rates.");
    }
  };

  const handleShare = async () => {
    if (modalRef.current) {
      const canvas = await html2canvas(modalRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      const image = canvas.toDataURL("image/png");

      // Convert to Blob
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], "exchange_rate.png", { type: "image/png" });

      // Create a URL for WhatsApp sharing
      const formData = new FormData();
      formData.append("file", file);

      const whatsappMessage = `Check out today's exchange rate! 📊`;
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(
        whatsappMessage,
      )}`;

      window.open(whatsappURL, "_blank");
    }
  };

  const handleScreenshot = async () => {
    if (modalRef.current) {
      const canvas = await html2canvas(modalRef.current, {
        scale: 3, // Increased scale for better resolution
        useCORS: true,
        backgroundColor: null, // Keeps transparency
      });

      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "exchange_rate_screenshot.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            Exchange Rates ({initialValues.baseCurrency}-
            {initialValues.quoteCurrency})
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsModalOpen(true)}
          >
            <Eye className="w-5 h-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full w-full">
          <DialogHeader>
            <DialogTitle>Exchange Rate Details</DialogTitle>
          </DialogHeader>
          <Card
            ref={modalRef}
            className="w-full mx-auto bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#3a506b] 
             text-white p-6 shadow-2xl border border-gray-700 rounded-lg relative overflow-hidden"
          >
            {/* Background Design (Optional Overlay) */}
            <div className="absolute inset-0 bg-[url('/patterns/currency-pattern.svg')] opacity-10 pointer-events-none"></div>

            <CardHeader className="flex justify-between items-center border-b border-gray-600 pb-3">
              <h2 className="text-2xl font-bold tracking-wide text-cyan-300">
                SMART GLOBAL HUB
              </h2>
              <p className="text-sm text-gray-400">
                {new Date().toLocaleDateString()}
              </p>
            </CardHeader>

            <CardContent className="text-center">
              <CardTitle className="text-lg font-semibold text-yellow-300">
                💹 Today&apos;s Exchange Rates
              </CardTitle>
              <Separator className="my-3 bg-gray-600" />

              <div className="text-lg space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>💵 {initialValues.baseCurrency}</span>
                  <span>💱 {initialValues.quoteCurrency}</span>
                </div>

                <div className="flex justify-between font-bold text-cyan-300">
                  <span>📌 Today&apos;s Rate</span>
                  <span className="text-glow">{initialValues.sellRate}</span>
                </div>

                <div className="flex justify-between font-bold text-green-300">
                  <span>🏦 Bank Rate</span>
                  <span className="text-glow">
                    {initialValues.sellRate + 0.25}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-red-300">
                  <span>💵 Cash Rate</span>
                  <span className="text-glow">
                    {initialValues.sellRate + 0.3}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-gray-600 pt-4 text-center">
              <p className="italic text-gray-400 text-sm">
                &ldquo; Your Trusted Partner 💼 &ldquo;
              </p>
            </CardFooter>
          </Card>
          <DialogFooter className="flex justify-between">
            <Button onClick={handleScreenshot}>Download</Button>
            <Button onClick={handleShare}>Share</Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
