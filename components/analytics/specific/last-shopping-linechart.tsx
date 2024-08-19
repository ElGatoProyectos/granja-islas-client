"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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

const shoppingExpense = [
  {
    month: "Ene",
    shopping: Math.floor(Math.random() * 100000),
  },
  {
    month: "Feb",
    shopping: Math.floor(Math.random() * 100000),
  },
  {
    month: "Mar",
    shopping: Math.floor(Math.random() * 100000),
  },
  {
    month: "Abr",
    shopping: Math.floor(Math.random() * 100000),
  },
  {
    month: "May",
    shopping: Math.floor(Math.random() * 100000),
  },
  {
    month: "Jun",
    shopping: Math.floor(Math.random() * 100000),
  },
  {
    month: "Jul",
    shopping: Math.floor(Math.random() * 100000),
  },
];

const chartConfig = {
  shopping: {
    label: "Gasto",
  },
} satisfies ChartConfig;

interface Props {
  label: string;
  date: string;
}

export function LastShoppingLinechart({ label, date }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Ultimas compras de {label}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart
            accessibilityLayer
            data={shoppingExpense}
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="shopping"
              type="linear"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
