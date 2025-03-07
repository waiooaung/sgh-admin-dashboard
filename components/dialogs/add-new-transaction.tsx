"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { CreateTransaction } from "@/types/transaction";
import { toast } from "sonner";

interface AddNewTransactionProps {
  onSuccess: () => void;
}
export function AddNewTransaction({ onSuccess }: AddNewTransactionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amountRMB, setAmountRMB] = useState<number>(0);
  const [buyRate, setBuyRate] = useState<number>(0);
  const [sellRate, setSellRate] = useState<number>(0);
  const [commissionRate, setCommissionRate] = useState<number>(0.003);
  const [agentId, setAgentId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");

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
    `/transactions`,
    async (url, { arg }: { arg: CreateTransaction }) => {
      return await axiosInstance.post<CreateTransaction>(url, arg);
    },
  );

  const handleNumberChange =
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setter(isNaN(value) ? 0 : value);
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const transactionData = {
      transactionDate: new Date(),
      amountRMB,
      buyRate,
      sellRate,
      commissionRate,
      agentId: Number(agentId),
      supplierId: Number(supplierId),
    };

    try {
      await trigger(transactionData);
      toast.success("Transaction added successfully!");
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create transaction!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Label>Amount (RMB)</Label>
            <Input
              type="number"
              value={amountRMB || ""}
              onChange={handleNumberChange(setAmountRMB)}
            />
            <Label>Buy Rate</Label>
            <Input
              type="number"
              value={buyRate || ""}
              onChange={handleNumberChange(setBuyRate)}
            />
            <Label>Sell Rate</Label>
            <Input
              type="number"
              value={sellRate || ""}
              onChange={handleNumberChange(setSellRate)}
            />
            <Label>Commission Rate</Label>
            <Input
              type="number"
              value={commissionRate || ""}
              onChange={handleNumberChange(setCommissionRate)}
            />

            <Label className="text-left">Agent</Label>
            <Select value={agentId} onValueChange={setAgentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Agent 1</SelectItem>
                <SelectItem value="2">Agent 2</SelectItem>
                <SelectItem value="3">Agent 3</SelectItem>
              </SelectContent>
            </Select>

            <Label className="text-left">Supplier</Label>
            <Select value={supplierId} onValueChange={setSupplierId}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Supplier 1</SelectItem>
                <SelectItem value="2">Supplier 2</SelectItem>
                <SelectItem value="3">Supplier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="">
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

          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
