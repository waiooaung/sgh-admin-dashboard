"use client";

import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle } from "lucide-react";

import useDataContext from "@/hooks/useDataContext";
import AgentOverview from "@/components/overviews/agent-overview";
import TransactionTable from "@/components/tables/transaction-table";
import ContactButton from "@/components/contact-button";

const AgentDetailContainer = () => {
  const { agent } = useDataContext();
  if (!agent) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p className="text-gray-500 text-lg">No agent information available.</p>
      </div>
    );
  }

  const agentId = agent.id;

  const formattedLastLogin = agent.updatedAt
    ? format(new Date(agent.updatedAt), "MMM dd, yyyy h:mm a")
    : "N/A";

  const formattedCreatedAt = agent.createdAt
    ? format(new Date(agent.createdAt), "MMM dd, yyyy")
    : "N/A";

  const formattedUpdatedAt = agent.updatedAt
    ? format(new Date(agent.updatedAt), "MMM dd, yyyy")
    : "N/A";

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Agent Detail</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Header Section */}
        <div className="flex items-center gap-6 p-6 border rounded-2xl shadow-md">
          <Avatar className="h-20 w-20">
            <AvatarImage alt={agent.name} />
            <AvatarFallback>{agent.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{agent.name}</h1>
            <Badge variant="default">
              {agent.name ? (
                <CheckCircle className="h-4 w-4 mr-1 inline" />
              ) : (
                <XCircle className="h-4 w-4 mr-1 inline" />
              )}
              Active
            </Badge>
          </div>
        </div>

        {/* Agent Details */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <p className="truncate">
              <strong>Name:</strong> {agent.contactName || "N/A"}
            </p>
            <p className="truncate">
              <strong>Email:</strong> {agent.contactEmail || "N/A"}
            </p>
            <span className="truncate flex items-center gap-1 whitespace-nowrap">
              <strong>Phone:</strong> {agent.contactPhone}
              <ContactButton phoneNumber={agent.contactPhone} />
            </span>
            <p className="truncate">
              <strong>Bank Account:</strong> {agent.bankAccount || "N/A"}
            </p>
            <p className="truncate">
              <strong>Address:</strong> {agent.address || "N/A"}
            </p>
            <p className="truncate">
              <strong>Created At:</strong> {formattedCreatedAt}
            </p>
            <p className="truncate">
              <strong>Updated At:</strong> {formattedUpdatedAt}
            </p>
            <p className="truncate">
              <strong>Last Login:</strong> {formattedLastLogin}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1">
        <AgentOverview tenantId={agent.tenantId} agentId={agent.id} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable defaultAgentId={agentId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDetailContainer;
