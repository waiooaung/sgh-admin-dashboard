"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { AddNewAgent } from "@/components/dialogs/add-new-agent";
import { mutate } from "swr";
import AgentTable from "@/components/tables/agent-table";

const AgentContainer = () => {
  const handleSubmit = async () => {
    await revalidateAll();
  };

  const revalidateAll = async () => {
    await mutate(
      (key) => typeof key === "string" && key.startsWith("/agents"),
      undefined,
      { revalidate: true },
    );
    await mutate(
      (key) => typeof key === "string" && key.startsWith("/transactions"),
      undefined,
      { revalidate: true },
    );
  };
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Agents</p>
        <AddNewAgent onSuccess={handleSubmit} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentContainer;
