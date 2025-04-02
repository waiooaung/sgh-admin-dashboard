"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AddNewTransaction } from "@/components/dialogs/add-new-transaction";
import TransactionTable from "@/components/tables/transaction-table";
import TransactionOverview from "@/components/overviews/transaction-overview";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import { Agent, AgentApiResponse } from "@/types/agent";
import { Supplier, SupplierApiResponse } from "@/types/supplier";
import {
  TransactionType,
  TransactionTypeApiResponse,
} from "@/types/transactionType";
import { Currency, CurrencyApiResponse } from "@/types/currency";
import {
  ProfitDisplayCurrency,
  ProfitDisplayCurrencyApiResponse,
} from "@/types/profitDisplayCurrency";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

const TransactionContainer = () => {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;
  const revalidateAll = async () => {
    await mutate(
      (key) =>
        typeof key === "string" &&
        key.startsWith("/dashboard/transaction-statistics"),
      undefined,
      { revalidate: true },
    );
    await mutate(
      (key) => typeof key === "string" && key.startsWith("/transactions"),
      undefined,
      { revalidate: true },
    );
  };

  const handleSubmit = async () => {
    await revalidateAll();
  };

  const { data: agentData, error: agentDataError } = useSWR<AgentApiResponse>(
    `/agents?limit=100&tenantId=${tenantId}`,
    fetcher,
  );
  if (agentDataError) toast.error("Error fetching agents.");
  const agents: Agent[] = agentData?.data || [];

  const { data: supplierData, error: supplierDataError } =
    useSWR<SupplierApiResponse>(
      `/suppliers?limit=100&tenantId=${tenantId}`,
      fetcher,
    );
  if (supplierDataError) toast.error("Error fetching suppliers.");
  const suppliers: Supplier[] = supplierData?.data || [];

  const { data: transactionTypesData, error: transactionTypesError } =
    useSWR<TransactionTypeApiResponse>(
      `/transaction-types?tenantId=${tenantId}`,
      fetcher,
    );
  if (transactionTypesError) toast.error("Error fetching transaction types.");
  const transactionTypes: TransactionType[] = transactionTypesData?.data || [];

  const { data: currenciesData, error: currenciesError } =
    useSWR<CurrencyApiResponse>(`/currencies?tenantId=${tenantId}`, fetcher);
  if (currenciesError) toast.error("Error fetching currencies.");
  const currencies: Currency[] = currenciesData?.data || [];

  const {
    data: profitDisplayCurrenciesData,
    error: profitDisplayCurrenciesError,
  } = useSWR<ProfitDisplayCurrencyApiResponse>(
    `/profit-display-currencies?tenantId=${tenantId}`,
    fetcher,
  );
  if (profitDisplayCurrenciesError)
    toast.error("Error fetching profit display currencies.");
  const profitDisplayCurrencies: ProfitDisplayCurrency[] =
    profitDisplayCurrenciesData?.data || [];

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Transactions</p>
        <AddNewTransaction
          onSuccess={handleSubmit}
          agents={agents}
          suppliers={suppliers}
          transactionTypes={transactionTypes}
          currencies={currencies}
          tenantId={tenantId}
          profitDisplayCurrencies={profitDisplayCurrencies}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <TransactionOverview />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable
              agentList={agents}
              supplierList={suppliers}
              transactionTypeList={transactionTypes}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionContainer;
