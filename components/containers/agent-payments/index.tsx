"use client";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import AgentPaymentTable from "@/components/tables/agent-payment-table";
import { AddAgentPayment } from "@/components/dialogs/add-agent-payment";
import { mutate } from "swr";
const AgentPaymentsContainer = () => {
  const handleSubmit = async () => {
    await mutate("/agent-payments?page=1&limit=10");
  };
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Agent Payments</p>
        <AddAgentPayment onSuccess={handleSubmit} />
      </div>

      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentPaymentTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentPaymentsContainer;
