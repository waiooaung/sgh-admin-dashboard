"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { name: "handlingFee", value: 275, fill: "var(--color-handlingFee)" },
  { name: "exchangeMargin", value: 200, fill: "var(--color-exchangeMargin)" },
  { name: "serviceCharges", value: 187, fill: "var(--color-serviceCharges)" },
  { name: "additionalFees", value: 173, fill: "var(--color-additionalFees)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  handlingFee: {
    label: "Handling Fee",
    color: "hsl(var(--chart-1))",
  },
  exchangeMargin: {
    label: "Exchange Margins",
    color: "hsl(var(--chart-2))",
  },
  serviceCharges: {
    label: "Service Charges",
    color: "hsl(var(--chart-3))",
  },
  additionalFees: {
    label: "Additional Fees",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function RevenueBreakdownPieChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
