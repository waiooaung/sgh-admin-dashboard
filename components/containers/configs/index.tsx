"use client";

import { ExchangeRateCard } from "@/components/cards/exchange-rate-card";
import { CommissionRateCard } from "@/components/cards/commission-rate-card";

export default function ConfigsContainer() {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExchangeRateCard />
        <CommissionRateCard />
      </div>
    </div>
  );
}
