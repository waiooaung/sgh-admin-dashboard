"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Agent } from "@/types/agent";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { Pencil, Trash, View } from "lucide-react";

import useDelete from "@/hooks/useDelete";
import EditAgent from "@/components/dialogs/edit-agent";
import useDataContext from "@/hooks/useDataContext";
import { useAuth } from "@/context/authContext";
import { useAgents } from "@/hooks/useAgents";
import AgentSkeletonTable from "@/components/tables/agent-skeleton-table";
import { PaginationControls } from "./pagination-controls";
import { ConfirmDialog } from "../dialogs/ConfirmDialog";

const AgentTable = () => {
  const router = useRouter();
  const { user } = useAuth();
  const tenantId = user?.tenantId || undefined;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { setAgent } = useDataContext();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [open, setOpen] = useState(false);

  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
  });

  if (tenantId) {
    queryParams.append("tenantId", tenantId.toString());
  }

  const { agents, meta, isLoading, mutate } = useAgents(queryParams);

  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setOpen(true);
  };

  const handleUpdate = () => {
    setOpen(false);
    mutate();
  };

  const { trigger: deleteAgent } = useDelete("agents");
  const handleDelete = async (id: number) => {
    try {
      await deleteAgent(id);
      toast.success("Agent deleted successfully!");
      mutate();
    } catch {
      toast.error(`Failed to delete agent`);
    }
  };

  const handleRedirect = (agent: Agent) => {
    setAgent(agent);
    router.push("agents/detail");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Table className="table-auto w-full text-xs text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <AgentSkeletonTable />
        ) : (
          <TableBody>
            {agents.map((agent) => (
              <TableRow
                key={agent.id}
                className="hover:bg-blend-color transition-colors"
              >
                <TableCell>
                  <a
                    className="cursor-pointer"
                    onClick={() => {
                      handleRedirect(agent);
                    }}
                  >
                    {agent.name}
                  </a>
                </TableCell>
                <TableCell>{agent.contactEmail}</TableCell>
                <TableCell>
                  <a
                    href={`https://wa.me/${agent.contactPhone}`}
                    target="_blank"
                  >
                    {agent.contactPhone}
                  </a>
                </TableCell>
                <TableCell>
                  {agent.createdAt
                    ? new Date(agent.createdAt).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-0">
                    <Button
                      size={null}
                      variant="ghost"
                      className="w-5 h-5 p-0 min-w-0 cursor-pointer"
                      onClick={() => {
                        handleRedirect(agent);
                      }}
                    >
                      <View className="w-3 h-3" />
                    </Button>

                    <Button
                      size={null}
                      variant="ghost"
                      className="w-5 h-5 p-0 min-w-0 cursor-pointer"
                      onClick={() => handleEdit(agent)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>

                    <ConfirmDialog
                      trigger={
                        <Button
                          size={null}
                          variant="ghost"
                          className="w-5 h-5 p-0 min-w-0 cursor-pointer text-red-600"
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      }
                      title="Delete Agent"
                      description="Are you sure you want to delete this agent?"
                      confirmText="Delete"
                      onConfirm={() => handleDelete(agent.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      {selectedAgent && (
        <EditAgent
          open={open}
          onClose={() => setOpen(false)}
          agent={selectedAgent}
          onSave={handleUpdate}
        />
      )}

      {meta && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm">
            Total : <span className="font-semibold">{meta.totalItems}</span>
          </p>

          <PaginationControls
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AgentTable;
