export type AgentFormData = {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  bankAccount: string;
};

export type Agent = AgentFormData & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};
