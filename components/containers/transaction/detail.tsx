"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, User, Banknote, Globe } from "lucide-react";
import useDataContext from "@/hooks/useDataContext";

const TransactionDetailContainer = () => {
  const { transaction } = useDataContext();
  if (!transaction) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p className="text-gray-500 text-lg">
          No transaction information available.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Transaction Detail
        </p>
      </div>
      <Card className="w-full shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Transaction - TNX-{transaction.baseCurrency.name}-
            {transaction.quoteCurrency.name}-{transaction.id}
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(transaction.transactionDate).toLocaleString()}
          </p>
        </CardHeader>

        <CardContent className="space-y-8 p-6">
          {/* Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusItem
              label="Agent Payment"
              value={transaction.agentPaymentStatus}
            />
            <StatusItem
              label="Supplier Payment"
              value={transaction.supplierPaymentStatus}
            />
            <StatusItem
              label="Deleted"
              value={transaction.isDeleted ? "Yes" : "No"}
            />
          </div>

          <Separator />

          {/* Currency Section */}
          <SectionTitle
            icon={<Banknote className="w-4 h-4" />}
            title="Currency & Amounts"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <CurrencyItem label="Base" currency={transaction.baseCurrency} />
            <CurrencyItem label="Quote" currency={transaction.quoteCurrency} />
            <Detail label="Buy Rate" value={transaction.buyRate} />
            <Detail label="Sell Rate" value={transaction.sellRate} />
            <Detail label="Base Amount" value={transaction.baseAmount} />
            <Detail label="Quote Buy" value={transaction.quoteAmountBuy} />
            <Detail label="Quote Sell" value={transaction.quoteAmountSell} />
          </div>

          <Separator />

          {/* Earnings Section */}
          <SectionTitle
            icon={<DollarSign className="w-4 h-4" />}
            title="Earnings Summary"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Detail label="Profit" value={transaction.profit} />
            <Detail
              label="Commission"
              value={`${transaction.commission} (${transaction.commissionRate}%)`}
            />
            <Detail label="Total Earnings" value={transaction.totalEarnings} />
          </div>

          <Separator />

          {/* Agent Section */}
          <SectionTitle
            icon={<User className="w-4 h-4" />}
            title="Agent Info"
          />
          <ProfileCard
            profile={transaction.Agent}
            received={transaction.amountReceivedFromAgent}
            remaining={transaction.remainingAmountFromAgent}
          />

          <Separator />

          {/* Supplier Section */}
          <SectionTitle
            icon={<Globe className="w-4 h-4" />}
            title="Supplier Info"
          />
          <ProfileCard
            profile={transaction.Supplier}
            received={transaction.amountPaidToSupplier}
            remaining={transaction.remainingAmountToPayToSupplier}
          />

          <Separator />

          {/* Profit Breakdown Table */}
          {/* <SectionTitle
            icon={<DollarSign className="w-4 h-4" />}
            title="Profit Breakdown"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.TransactionProfit.map((profit: any) => (
                <TableRow key={profit.id}>
                  <TableCell>
                    {profit.Currency.name} ({profit.Currency.symbol})
                  </TableCell>
                  <TableCell>{profit.rate}</TableCell>
                  <TableCell>{profit.profitAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
        </CardContent>
      </Card>
    </div>
  );

  function SectionTitle({
    title,
    icon,
  }: {
    title: string;
    icon: React.ReactNode;
  }) {
    return (
      <div className="flex items-center gap-2 text-lg font-semibold mb-4">
        {icon}
        {title}
      </div>
    );
  }

  function StatusItem({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs uppercase">{label}</span>
        <Badge variant="outline" className="mt-1 w-fit">
          {value}
        </Badge>
      </div>
    );
  }

  function Detail({ label, value }: { label: string; value: any }) {
    return (
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs uppercase">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    );
  }

  function CurrencyItem({ label, currency }: { label: string; currency: any }) {
    return (
      <Detail
        label={`${label} Currency`}
        value={`${currency.name} (${currency.symbol})`}
      />
    );
  }

  function ProfileCard({
    profile,
    received,
    remaining,
  }: {
    profile: any;
    received: any;
    remaining: any;
  }) {
    return (
      <Card className="bg-muted/40 border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Detail label="Name" value={profile.name} />
          <Detail label="Email" value={profile.contactEmail} />
          <Detail label="Phone" value={profile.contactPhone} />
          <Detail label="Country" value={profile.country} />
          <Detail label="Address" value={profile.address} />
          <Detail label="Bank Account" value={profile.bankAccount} />
          <Detail label="Received" value={received} />
          <Detail label="Remaining" value={remaining} />
        </div>
      </Card>
    );
  }
};

export default TransactionDetailContainer;
