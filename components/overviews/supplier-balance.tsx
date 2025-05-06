import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useSupplierBalances } from "@/hooks/useSupplierBalances";

const SupplierBalances = ({ supplierId }: { supplierId: number }) => {
  const { supplierBalances } = useSupplierBalances(supplierId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-3">
      {supplierBalances.map((supplierBalance) => (
        <Card key={supplierBalance.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium truncate">
              {supplierBalance.currency.name} ({supplierBalance.currency.symbol}
              )
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-green-500 truncate">
              {supplierBalance.paidAmount}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SupplierBalances;
