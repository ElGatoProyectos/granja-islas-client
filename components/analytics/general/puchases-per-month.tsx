"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatNumberWithCommas } from "@/utils/format-number-comas";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

function getRandomValue(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const purchases = [
  { month: "Ene", purchase: getRandomValue(0, 80000) },
  { month: "Feb", purchase: getRandomValue(0, 80000) },
  { month: "Mar", purchase: getRandomValue(0, 80000) },
  { month: "Abr", purchase: getRandomValue(0, 80000) },
  { month: "May", purchase: getRandomValue(0, 80000) },
  { month: "Jun", purchase: getRandomValue(0, 80000) },
  //   { month: "Jul", value: getRandomValue(0, 80000) },
  //   { month: "Ago", value: getRandomValue(0, 80000) },
  //   { month: "Sep", value: getRandomValue(0, 80000) },
  //   { month: "Oct", value: getRandomValue(0, 80000) },
  //   { month: "Nov", value: getRandomValue(0, 80000) },
  //   { month: "Dic", value: getRandomValue(0, 80000) },
];

const chartConfig = {
  purchase: {
    label: "Compras",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;



export function PurchasesPerMoth() {
  return (
    <ChartContainer config={chartConfig} className="h-[450px] w-full">
      <BarChart accessibilityLayer data={purchases}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          dataKey="purchase"
          tickFormatter={formatNumberWithCommas}
          tickLine={false}
          axisLine={false}
          padding={{ top: 0, bottom: 0 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="purchase" fill="var(--color-purchase)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
