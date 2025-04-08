"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import { Transaction } from "@/types/transaction";
import { Supplier } from "@/types/supplier";
import { Agent } from "@/types/agent";
import { AgentPayment } from "@/types/agentPayment";
import { SupplierPayment } from "@/types/supplierPayment";

// Define the context for Supplier data
export const DataContext = createContext<{
  transaction: Transaction | null;
  setTransaction: (transaction: Transaction | null) => void;
  supplier: Supplier | null;
  setSupplier: (supplier: Supplier | null) => void;
  agent: Agent | null;
  setAgent: (agent: Agent | null) => void;
  agentPayment: AgentPayment | null;
  setAgentPayment: (agentPayment: AgentPayment | null) => void;
  supplierPayment: SupplierPayment | null;
  setSupplierPayment: (supplierPayment: SupplierPayment | null) => void;
}>({
  transaction: null,
  setTransaction: () => {},
  supplier: null,
  setSupplier: () => {},
  agent: null,
  setAgent: () => {},
  agentPayment: null,
  setAgentPayment: () => {},
  supplierPayment: null,
  setSupplierPayment: () => {},
});

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agentPayment, setAgentPayment] = useState<AgentPayment | null>(null);
  const [supplierPayment, setSupplierPayment] =
    useState<SupplierPayment | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTransaction = localStorage.getItem("transaction");
      const storedSupplier = localStorage.getItem("supplier");
      const storedAgent = localStorage.getItem("agent");
      const storedAgentPayment = localStorage.getItem("agentPayment");
      const storedSupplierPayment = localStorage.getItem("supplierPayment");

      if (storedTransaction) {
        setTransaction(JSON.parse(storedTransaction));
      }

      if (storedSupplier) {
        setSupplier(JSON.parse(storedSupplier));
      }
      if (storedAgent) {
        setAgent(JSON.parse(storedAgent));
      }

      if (storedAgentPayment) {
        setAgentPayment(JSON.parse(storedAgentPayment));
      }

      if (storedSupplierPayment) {
        setSupplierPayment(JSON.parse(storedSupplierPayment));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && transaction) {
      localStorage.setItem("transaction", JSON.stringify(transaction));
    }

    if (typeof window !== "undefined" && supplier) {
      localStorage.setItem("supplier", JSON.stringify(supplier));
    }
    if (typeof window !== "undefined" && agent) {
      localStorage.setItem("agent", JSON.stringify(agent));
    }

    if (typeof window !== "undefined" && agentPayment) {
      localStorage.setItem("agentPayment", JSON.stringify(agentPayment));
    }

    if (typeof window !== "undefined" && supplierPayment) {
      localStorage.setItem("supplierPayment", JSON.stringify(supplierPayment));
    }
  }, [transaction, supplier, agent, agentPayment, supplierPayment]);

  return (
    <DataContext.Provider
      value={{
        transaction,
        setTransaction,
        supplier,
        setSupplier,
        agent,
        setAgent,
        agentPayment,
        setAgentPayment,
        supplierPayment,
        setSupplierPayment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
