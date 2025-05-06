import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useAgentBalances } from "@/hooks/useAgentBalances";

const AgentBalances = ({ agentId }: { agentId: number }) => {
  const { agentBalances } = useAgentBalances(agentId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-3">
      {agentBalances.map((agentBalance) => (
        <Card key={agentBalance.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              {agentBalance.currency.name} ({agentBalance.currency.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-green-500 truncate">
              {agentBalance.receivedAmount}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AgentBalances;
