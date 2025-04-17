"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { ExchangeRateDetail } from "../dialogs/exchange-rate-public";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Props {
  defaultDateFrom?: Date;
  defaultDateTo?: Date;
}

export function ExchangeRateCard({ defaultDateFrom, defaultDateTo }: Props) {
  const { user } = useAuth();
  const tenantId = user ? user.tenantId : undefined;
  const currentPage = 1;
  const itemsPerPage = 100;

  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
  });
  if (tenantId) {
    queryParams.append("tenantId", tenantId.toString());
  }
  if (defaultDateFrom) {
    defaultDateFrom.setHours(0, 0, 0, 0);
    queryParams.append("from", defaultDateFrom.toISOString());
  }
  if (defaultDateTo) {
    defaultDateTo.setHours(23, 59, 59, 999);
    queryParams.append("to", defaultDateTo.toISOString());
  }
  const { exchangeRates, isLoading } = useExchangeRates(queryParams);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Exchange Rates (Today)</span>
          {exchangeRates && !isLoading && (
            <ExchangeRateDetail exchangeRates={exchangeRates} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Table className="min-w-full shadow-md rounded-lg overflow-hidden">
            <TableHeader className="text-sm font-semibold">
              <TableRow>
                <TableHead className="text-left truncate">Name</TableHead>
                <TableHead className="text-left truncate">Exchange</TableHead>
                <TableHead className="text-left truncate">Buy Rate</TableHead>
                <TableHead className="text-left truncate">Sell Rate</TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell className="truncate">Loading...</TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {exchangeRates.map((data) => (
                  <TableRow
                    key={data.id}
                    className="hover:bg-blend-color transition-colors"
                  >
                    <TableCell className="truncate">{data.name}</TableCell>
                    <TableCell className="truncate">
                      {data.baseCurrency.name} - {data.quoteCurrency.name}
                    </TableCell>
                    <TableCell className="truncate">{data.buyRate}</TableCell>
                    <TableCell className="truncate">{data.sellRate}</TableCell>
                    <TableCell className="truncate">
                      {new Date(data.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
