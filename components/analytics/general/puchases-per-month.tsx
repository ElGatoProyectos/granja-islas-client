"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberWithCommas } from "@/utils/format-number-comas";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface Months {
  enero: number;
  febrero: number;
  marzo: number;
  abril: number;
  mayo: number;
  junio: number;
  julio: number;
  agosto: number;
  septiembre: number;
  octubre: number;
  noviembre: number;
  diciembre: number;
}

const monthMapping: Record<keyof Months, string> = {
  enero: "Ene",
  febrero: "Feb",
  marzo: "Mar",
  abril: "Abr",
  mayo: "May",
  junio: "Jun",
  julio: "Jul",
  agosto: "Ago",
  septiembre: "Sep",
  octubre: "Oct",
  noviembre: "Nov",
  diciembre: "Dic",
};

const chartConfig = {
  purchase: {
    label: "Compras",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PurchasesPerMoth({ buyforMonth }: { buyforMonth?: Months }) {
  if (!buyforMonth)
    return (
      <div>
        <Skeleton className="h-[450px] w-full" />
      </div>
    );

  const purchases = (
    Object.entries(buyforMonth) as [keyof Months, number][]
  ).map(([month, purchase]) => ({
    month: monthMapping[month],
    purchase,
  }));

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
