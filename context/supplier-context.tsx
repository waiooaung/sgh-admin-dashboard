"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import { Supplier } from "@/types/supplier";
import { Agent } from "@/types/agent";

// Define the context for Supplier data
export const DataContext = createContext<{
  supplier: Supplier | null;
  setSupplier: (supplier: Supplier | null) => void;
  agent: Agent | null;
  setAgent: (agent: Agent | null) => void;
}>({
  supplier: null,
  setSupplier: () => {},
  agent: null,
  setAgent: () => {},
});

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSupplier = localStorage.getItem("supplier");
      const storedAgent = localStorage.getItem("agent");

      if (storedSupplier) {
        setSupplier(JSON.parse(storedSupplier));
      }
      if (storedAgent) {
        setAgent(JSON.parse(storedAgent));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && supplier) {
      localStorage.setItem("supplier", JSON.stringify(supplier));
    }
    if (typeof window !== "undefined" && agent) {
      localStorage.setItem("agent", JSON.stringify(agent));
    }
  }, [supplier, agent]);

  return (
    <DataContext.Provider value={{ supplier, setSupplier, agent, setAgent }}>
      {children}
    </DataContext.Provider>
  );
};
