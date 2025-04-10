import { MetaData } from "./meta-data";

export type AgentFormData = {
  tenantId: number;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  address: string;
  bankAccount: string;
};

export type Agent = AgentFormData & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AgentApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: Agent[];
  meta: MetaData;
  overview: null;
};
