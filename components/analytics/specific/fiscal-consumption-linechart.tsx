"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { formatNumberWithCommas } from "@/utils/format-number-comas";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const monthlyExpense = [
  {
    month: "Ene",
    expense: Math.floor(Math.random() * 100000),
    average: Math.floor(Math.random() * 100000),
  },
  {
    month: "Feb",
    expense: Math.floor(Math.random() * 100000),
    average: Math.floor(Math.random() * 100000),
  },
  {
    month: "Mar",
    expense: Math.floor(Math.random() * 100000),
    average: Math.floor(Math.random() * 100000),
  },
  {
    month: "Abr",
    expense: Math.floor(Math.random() * 100000),
    average: Math.floor(Math.random() * 100000),
  },
  {
    month: "May",
    expense: Math.floor(Math.random() * 100000),
    average: Math.floor(Math.random() * 100000),
  },
  {
    month: "Jun",
    expense: Math.floor(Math.random() * 100000),
    average: Math.floor(Math.random() * 100000),
  },
  {
    month: "Jul",
    expense: Math.floor(Math.random() * 100000),
    average: Math.floor(Math.random() * 100000),
  },
];

const chartConfig = {
  expense: {
    label: "Gasto",
  },
  average: {
    label: "Promedio",
  },
} satisfies ChartConfig;

export function FiscalConsumptionLinechart({
  label,
  date,
}: {
  label: string;
  date: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Consumo fiscal de {label}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart
            accessibilityLayer
            data={monthlyExpense}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={85}
              tickFormatter={formatNumberWithCommas}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="average"
              type="monotone"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
