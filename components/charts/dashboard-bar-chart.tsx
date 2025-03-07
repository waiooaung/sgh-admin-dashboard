"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
  { date: "2024-04-01", profit: 222, transactions: 150 },
  { date: "2024-04-02", profit: 97, transactions: 180 },
  { date: "2024-04-03", profit: 167, transactions: 120 },
  { date: "2024-04-04", profit: 242, transactions: 260 },
  { date: "2024-04-05", profit: 373, transactions: 290 },
  { date: "2024-04-06", profit: 301, transactions: 340 },
  { date: "2024-04-07", profit: 245, transactions: 180 },
  { date: "2024-04-08", profit: 409, transactions: 320 },
  { date: "2024-04-09", profit: 59, transactions: 110 },
  { date: "2024-04-10", profit: 261, transactions: 190 },
  { date: "2024-04-11", profit: 327, transactions: 350 },
  { date: "2024-04-12", profit: 292, transactions: 210 },
  { date: "2024-04-13", profit: 342, transactions: 380 },
  { date: "2024-04-14", profit: 137, transactions: 220 },
  { date: "2024-04-15", profit: 120, transactions: 170 },
  { date: "2024-04-16", profit: 138, transactions: 190 },
  { date: "2024-04-17", profit: 446, transactions: 360 },
  { date: "2024-04-18", profit: 364, transactions: 410 },
  { date: "2024-04-19", profit: 243, transactions: 180 },
  { date: "2024-04-20", profit: 89, transactions: 150 },
  { date: "2024-04-21", profit: 137, transactions: 200 },
  { date: "2024-04-22", profit: 224, transactions: 170 },
  { date: "2024-04-23", profit: 138, transactions: 230 },
  { date: "2024-04-24", profit: 387, transactions: 290 },
  { date: "2024-04-25", profit: 215, transactions: 250 },
  { date: "2024-04-26", profit: 75, transactions: 130 },
  { date: "2024-04-27", profit: 383, transactions: 420 },
  { date: "2024-04-28", profit: 122, transactions: 180 },
  { date: "2024-04-29", profit: 315, transactions: 240 },
  { date: "2024-04-30", profit: 454, transactions: 380 },
  { date: "2024-05-01", profit: 165, transactions: 220 },
  { date: "2024-05-02", profit: 293, transactions: 310 },
  { date: "2024-05-03", profit: 247, transactions: 190 },
  { date: "2024-05-04", profit: 385, transactions: 420 },
  { date: "2024-05-05", profit: 481, transactions: 390 },
  { date: "2024-05-06", profit: 498, transactions: 520 },
  { date: "2024-05-07", profit: 388, transactions: 300 },
  { date: "2024-05-08", profit: 149, transactions: 210 },
  { date: "2024-05-09", profit: 227, transactions: 180 },
  { date: "2024-05-10", profit: 293, transactions: 330 },
  { date: "2024-05-11", profit: 335, transactions: 270 },
  { date: "2024-05-12", profit: 197, transactions: 240 },
  { date: "2024-05-13", profit: 197, transactions: 160 },
  { date: "2024-05-14", profit: 448, transactions: 490 },
  { date: "2024-05-15", profit: 473, transactions: 380 },
  { date: "2024-05-16", profit: 338, transactions: 400 },
  { date: "2024-05-17", profit: 499, transactions: 420 },
  { date: "2024-05-18", profit: 315, transactions: 350 },
  { date: "2024-05-19", profit: 235, transactions: 180 },
  { date: "2024-05-20", profit: 177, transactions: 230 },
  { date: "2024-05-21", profit: 82, transactions: 140 },
  { date: "2024-05-22", profit: 81, transactions: 120 },
  { date: "2024-05-23", profit: 252, transactions: 290 },
  { date: "2024-05-24", profit: 294, transactions: 220 },
  { date: "2024-05-25", profit: 201, transactions: 250 },
  { date: "2024-05-26", profit: 213, transactions: 170 },
  { date: "2024-05-27", profit: 420, transactions: 460 },
  { date: "2024-05-28", profit: 233, transactions: 190 },
  { date: "2024-05-29", profit: 78, transactions: 130 },
  { date: "2024-05-30", profit: 340, transactions: 280 },
  { date: "2024-05-31", profit: 178, transactions: 230 },
  { date: "2024-06-01", profit: 178, transactions: 200 },
  { date: "2024-06-02", profit: 470, transactions: 410 },
  { date: "2024-06-03", profit: 103, transactions: 160 },
  { date: "2024-06-04", profit: 439, transactions: 380 },
  { date: "2024-06-05", profit: 88, transactions: 140 },
  { date: "2024-06-06", profit: 294, transactions: 250 },
  { date: "2024-06-07", profit: 323, transactions: 370 },
  { date: "2024-06-08", profit: 385, transactions: 320 },
  { date: "2024-06-09", profit: 438, transactions: 480 },
  { date: "2024-06-10", profit: 155, transactions: 200 },
  { date: "2024-06-11", profit: 92, transactions: 150 },
  { date: "2024-06-12", profit: 492, transactions: 420 },
  { date: "2024-06-13", profit: 81, transactions: 130 },
  { date: "2024-06-14", profit: 426, transactions: 380 },
  { date: "2024-06-15", profit: 307, transactions: 350 },
  { date: "2024-06-16", profit: 371, transactions: 310 },
  { date: "2024-06-17", profit: 475, transactions: 520 },
  { date: "2024-06-18", profit: 107, transactions: 170 },
  { date: "2024-06-19", profit: 341, transactions: 290 },
  { date: "2024-06-20", profit: 408, transactions: 450 },
  { date: "2024-06-21", profit: 169, transactions: 210 },
  { date: "2024-06-22", profit: 317, transactions: 270 },
  { date: "2024-06-23", profit: 480, transactions: 530 },
  { date: "2024-06-24", profit: 132, transactions: 180 },
  { date: "2024-06-25", profit: 141, transactions: 190 },
  { date: "2024-06-26", profit: 434, transactions: 380 },
  { date: "2024-06-27", profit: 448, transactions: 490 },
  { date: "2024-06-28", profit: 149, transactions: 200 },
  { date: "2024-06-29", profit: 103, transactions: 160 },
  { date: "2024-06-30", profit: 446, transactions: 400 },
];

const chartConfig = {
  views: {
    label: "Overview",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-1))",
  },
  transactions: {
    label: "Transactions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DashboardBarChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("profit");

  const total = React.useMemo(
    () => ({
      profit: chartData.reduce((acc, curr) => acc + curr.profit, 0),
      transactions: chartData.reduce((acc, curr) => acc + curr.transactions, 0),
    }),
    [],
  );

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Overview ( Profit - Transactions )</CardTitle>
          <CardDescription>
            Showing total transactions and profit rates.
          </CardDescription>
        </div>
        <div className="flex">
          {["profit", "transactions"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
