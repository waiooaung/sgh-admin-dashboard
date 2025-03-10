"use client";

import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

import { Agent } from "@/types/agent";
import { MetaData } from "@/types/meta-data";

import { AddNewAgent } from "@/components/dialogs/add-new-agent";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  MoreHorizontal,
  Pencil,
  Trash,
  ArrowLeft,
  ArrowRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import useDelete from "@/hooks/useDelete";
import EditAgent from "@/components/dialogs/edit-agent";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Agent[];
  meta: MetaData;
}

const AgentContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [open, setOpen] = useState(false);
  const { data, mutate } = useSWR<ApiResponse>(
    `/agents?page=${currentPage}&limit=${itemsPerPage}`,
    fetcher,
  );

  const agents = data?.data || [];
  const meta = data?.meta || {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage,
  };

  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    console.log(selectedFilter);
  };

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
    } catch (deleteError) {
      toast.error(`Failed to delete agent: ${JSON.stringify(deleteError)}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Agents Management
        </p>
        <AddNewAgent onSuccess={() => mutate()} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            {/* Title */}
            <CardTitle>Agents ({meta.totalItems})</CardTitle>

            {/* Filter Dropdown Inside Card Header */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleFilterChange("All")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("Active")}>
                  Active Agents
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("Inactive")}
                >
                  Inactive Agents
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
              <TableHeader className="text-sm font-semibold">
                <TableRow>
                  <TableHead className="p-3 text-left">Name</TableHead>
                  <TableHead className="p-3 text-left">Email</TableHead>
                  <TableHead className="p-3 text-left">Phone</TableHead>
                  <TableHead className="p-3 text-left">CreatedAt</TableHead>
                  <TableHead className="p-3 text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow
                    key={agent.id}
                    className="hover:bg-blend-color transition-colors"
                  >
                    <TableCell className="p-3">{agent.name}</TableCell>
                    <TableCell className="p-3">{agent.contactEmail}</TableCell>
                    <TableCell className="p-3">{agent.contactPhone}</TableCell>
                    <TableCell className="p-3">
                      {agent.createdAt
                        ? new Date(agent.createdAt).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(agent)}>
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(agent.id)}
                          >
                            <Trash className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {selectedAgent && (
              <EditAgent
                open={open}
                onClose={() => setOpen(false)}
                agent={selectedAgent}
                onSave={handleUpdate}
              />
            )}

            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setCurrentPage(meta.currentPage - 1)}
                disabled={meta.currentPage === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-sm font-medium">
                Page {meta.currentPage} of {meta.totalPages}
              </span>

              <Button
                onClick={() => setCurrentPage(meta.currentPage + 1)}
                disabled={meta.currentPage >= meta.totalPages}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentContainer;
