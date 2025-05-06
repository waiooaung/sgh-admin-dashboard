import SupplierBalances from "../overviews/supplier-balance";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const SupplierBalanceCard = ({ supplierId }: { supplierId: number }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <SupplierBalances supplierId={supplierId} />
      </CardContent>
    </Card>
  );
};
