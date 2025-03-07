// components/user-management/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";

interface User {
  id: number;
  email: string;
  active: boolean;
  createdAt: Date;
  lastLogin: Date;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

export const columns = (
  toggleUserStatus: (id: number) => void,
): ColumnDef<User>[] => [
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (row.original.active ? "Active" : "Inactive"),
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => formatDate(row.original.lastLogin),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Switch
        checked={row.original.active}
        onCheckedChange={() => toggleUserStatus(row.original.id)}
      />
    ),
  },
];
