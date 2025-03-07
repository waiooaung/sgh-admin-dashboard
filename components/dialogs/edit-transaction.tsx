import { useState } from "react";
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

interface Transaction {
  id: number;
  transactionDate: string;
  amountRMB: number;
  buyRate: number;
  sellRate: number;
}

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSave: (updatedTransaction: Transaction) => void;
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

  if (!transaction) return null; // Prevent rendering if no transaction

  const handleChange = (field: keyof Transaction, value: string | number) => {
    if (editTransaction) {
      setEditTransaction({ ...editTransaction, [field]: value });
    }
  };

  const handleSubmit = () => {
    if (editTransaction) {
      onSave(editTransaction);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={editTransaction?.transactionDate}
              onChange={(e) => handleChange("transactionDate", e.target.value)}
            />
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
        </div>
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
