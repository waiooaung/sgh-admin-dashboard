import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";
import { UpdateTransaction } from "@/types/transaction";
import { toast } from "sonner";

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
  onSave: () => void;
}

const EditTransaction: React.FC<EditTransactionModalProps> = ({
  open,
  onClose,
  transaction,
  onSave,
}) => {
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    transaction,
  );

  useEffect(() => {
    if (open && transaction) {
      setEditTransaction(transaction);
    }
  }, [open, transaction]);

  const { amountUSDBuy, amountUSDSell, commission, profit, totalEarningsUSD } =
    useMemo(() => {
      if (!editTransaction) {
        return {
          amountUSDBuy: 0,
          amountUSDSell: 0,
          commission: 0,
          profit: 0,
          totalEarningsUSD: 0,
        };
      }

      const { amountRMB, buyRate, sellRate, commissionRate } = editTransaction;

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
    }, [editTransaction]);

  const { trigger } = useSWRMutation(
    `/transactions/${editTransaction?.id}`,
    async (url: string, { arg }: { arg: UpdateTransaction }) => {
      return await axiosInstance.put<Transaction>(url, arg);
    },
  );

  const handleChange = (field: keyof Transaction, value: string | number) => {
    if (editTransaction) {
      setEditTransaction({ ...editTransaction, [field]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (editTransaction) {
        // Ensure transactionDate is converted to Date if needed
        const updatedTransaction: UpdateTransaction = {
          ...editTransaction,
          transactionDate: new Date(editTransaction.transactionDate), // Ensure it's a Date
        };
        await trigger(updatedTransaction);
        toast.success("Transaction updated successfully!");
        onSave();
      }
    } catch (error) {
      console.error(error);
      toast.error("Fail to update transaction");
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Transaction Date</Label>
            <br />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !editTransaction?.transactionDate &&
                      "text-muted-foreground",
                  )}
                >
                  <CalendarIcon />
                  {editTransaction?.transactionDate ? (
                    format(editTransaction.transactionDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={
                    editTransaction?.transactionDate
                      ? new Date(editTransaction.transactionDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    handleChange(
                      "transactionDate",
                      date ? date.toDateString() : "",
                    )
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Amount (RMB)</Label>
            <Input
              type="number"
              value={editTransaction?.amountRMB}
              onChange={(e) =>
                handleChange("amountRMB", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Buy Rate</Label>
            <Input
              type="number"
              value={editTransaction?.buyRate}
              onChange={(e) => handleChange("buyRate", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Sell Rate</Label>
            <Input
              type="number"
              value={editTransaction?.sellRate}
              onChange={(e) => handleChange("sellRate", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Commission Rate</Label>
            <Input
              type="number"
              value={editTransaction?.commissionRate}
              onChange={(e) =>
                handleChange("commissionRate", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label className="text-left">Agent</Label>
            <Select
              value={
                editTransaction?.agentId
                  ? String(editTransaction.agentId)
                  : undefined
              }
              onValueChange={(value) => handleChange("agentId", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Agent 1</SelectItem>
                <SelectItem value="2">Agent 2</SelectItem>
                <SelectItem value="3">Agent 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Label className="text-left">Supplier</Label>
          <Select
            value={
              editTransaction?.supplierId
                ? String(editTransaction.supplierId)
                : undefined
            }
            onValueChange={(value) => handleChange("supplierId", Number(value))}
          >
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
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransaction;
