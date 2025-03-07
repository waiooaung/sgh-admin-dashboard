"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types/transaction";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "amount_rmb",
    header: "Amount (RMB)",
  },
  {
    accessorKey: "rate",
    header: "Rate",
  },
  {
    accessorKey: "rate_agent",
    header: "Rate (Agent)",
  },
  {
    accessorKey: "amount_usd",
    header: "Amount $",
  },
  {
    accessorKey: "amount_agent_usd",
    header: "Amount (Agent-$)",
  },
  {
    accessorKey: "commission_usd",
    header: "Commission",
  },
  {
    accessorKey: "amount_total_usd",
    header: "Total Amount $",
  },
  {
    accessorKey: "amount_paid_usd",
    header: "Paid Amount $",
  },
  {
    accessorKey: "amount_due_usd",
    header: "Due Amount $",
  },
  {
    accessorKey: "payment_status",
    header: "Status",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copy ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
