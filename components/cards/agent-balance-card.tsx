import AgentBalances from "../overviews/agent-balances";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const AgentBalanceCard = ({ agentId }: { agentId: number }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amount Credit</CardTitle>
      </CardHeader>
      <CardContent>
        <AgentBalances agentId={agentId} />
      </CardContent>
    </Card>
  );
};
