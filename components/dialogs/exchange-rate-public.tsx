"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas-pro";
import { Separator } from "../ui/separator";
import { ExchangeRate } from "@/types/exchangeRate";
import { Eye } from "lucide-react";

interface ExchangeRateDetailProps {
  exchangeRates: ExchangeRate[];
}

export function ExchangeRateDetail({ exchangeRates }: ExchangeRateDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    if (modalRef.current) {
      const canvas = await html2canvas(modalRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
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
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsModalOpen(true)}
        >
          <Eye className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full w-full">
        <DialogHeader>
          <DialogTitle>Exchange Rate Details</DialogTitle>
        </DialogHeader>
        <Card
          ref={modalRef}
          className="w-full mx-auto bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#3a506b] 
            text-white p-6 shadow-2xl border border-gray-700 rounded-lg relative overflow-hidden"
        >
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
              {/* <div className="flex justify-between text-gray-400">
                <span></span>
                <span></span>
              </div> */}

              {exchangeRates.length > 0 &&
                exchangeRates.map((data) => (
                  <div
                    key={data.id}
                    className="flex justify-between font-bold text-cyan-300"
                  >
                    <span>{data.name}</span>
                    <span>
                      {data.baseCurrency.name} - {data.quoteCurrency.name}
                    </span>
                    <span className="text-glow">{data.sellRate}</span>
                  </div>
                ))}
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
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
