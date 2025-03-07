"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ExchangeRateCard() {
  const [exchangeRate, setExchangeRate] = useState(6.8);
  const [customerExchangeRate, setCustomerExchangeRate] = useState(6.9);

  const handleSaveRates = () => {
    console.log("Cost Rate:", exchangeRate);
    console.log("Customer Rate:", customerExchangeRate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Rates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Buy Rate (RMB/USD)
          </label>
          <Input
            type="number"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Customer Exchange Rate (RMB/USD)
          </label>
          <Input
            type="number"
            value={customerExchangeRate}
            onChange={(e) =>
              setCustomerExchangeRate(parseFloat(e.target.value))
            }
          />
        </div>
        <Button onClick={handleSaveRates}>Save Rates</Button>
      </CardContent>
    </Card>
  );
}
