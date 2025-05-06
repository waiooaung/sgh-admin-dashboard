import SupplierOverview from "../overviews/supplier-overview";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const SupplierOverviewCard = ({
  tenantId,
  supplierId,
}: {
  tenantId: number;
  supplierId: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Overviews</CardTitle>
      </CardHeader>
      <CardContent>
        <SupplierOverview tenantId={tenantId} supplierId={supplierId} />
      </CardContent>
    </Card>
  );
};
