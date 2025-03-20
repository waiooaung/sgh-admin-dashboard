"use client";

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

interface BarChartProps {
  data: { [key: string]: any }[];
  xAxisKey?: string;
  bars: { key: string; color: string }[]; // ✅ Supports multiple bars
  width?: number;
  height?: number;
  title?: string;
  showTooltip?: boolean;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function CustomBarChart({
  data,
  xAxisKey = "date",
  bars = [{ key: "transaction", color: "#82ca9d" }], // ✅ Default bar setup
  title = "Bar Chart",
  showTooltip = true,
}: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            {showTooltip && (
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
            )}
            {bars.map((bar, index) => (
              <Bar key={index} dataKey={bar.key} fill={bar.color} radius={10} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
