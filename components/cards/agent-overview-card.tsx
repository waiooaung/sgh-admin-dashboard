import AgentOverview from "../overviews/agent-overview";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const AgentOverviewCard = ({
  tenantId,
  agentId,
}: {
  tenantId: number;
  agentId: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Overviews</CardTitle>
      </CardHeader>
      <CardContent>
        <AgentOverview tenantId={tenantId} agentId={agentId} />
      </CardContent>
    </Card>
  );
};
