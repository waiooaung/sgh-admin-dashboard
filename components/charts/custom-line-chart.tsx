"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

interface CustomLineChartProps {
  data: { [key: string]: any }[];
  xAxisKey?: string;
  yAxisKey?: string;
  lineColor?: string;
  width?: number;
  height?: number;
  title?: string;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function CustomLineChart({
  data,
  xAxisKey = "date",
  yAxisKey = "profit",
  lineColor = "#82ca9d",
  title = "Line Chart",
}: CustomLineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={true}
              axisLine={true}
              interval={0}
              tickMargin={10}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey={yAxisKey}
              type="linear"
              stroke={lineColor}
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
