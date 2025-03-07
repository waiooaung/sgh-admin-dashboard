"use client";

import { useState } from "react";
import { columns } from "./columns";
import { AddNewUser } from "@/components/dialogs/add-new-user";
import { DataTable } from "./data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface User {
  id: number;
  email: string;
  active: boolean;
  createdAt: Date;
  lastLogin: Date;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      email: "john.doe@example.com",
      active: true,
      createdAt: new Date("2024-02-10"),
      lastLogin: new Date("2024-02-25"),
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      active: false,
      createdAt: new Date("2024-01-15"),
      lastLogin: new Date("2024-02-20"),
    },
  ]);

  const [newEmail, setNewEmail] = useState("");

  // Function to format date
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);

  // Function to add a new user
  const addUser = () => {
    if (newEmail.trim() === "") return;
    setUsers([
      ...users,
      {
        id: users.length + 1,
        email: newEmail,
        active: true,
        createdAt: new Date(),
        lastLogin: new Date(),
      },
    ]);
    setNewEmail("");
  };

  // Toggle user active/inactive status
  const toggleUserStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user,
      ),
    );
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          User Management Settings
        </p>
        <AddNewUser />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent>
            <DataTable data={users} columns={columns(toggleUserStatus)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
