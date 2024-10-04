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
import { SpecificAnalyticChart } from "@/types/analytic";
import { formatNumberWithCommas } from "@/utils/format-number-comas";

const chartConfig = {
  amount: {
    label: "Gasto",
  },
  average: {
    label: "Promedio",
  },
} satisfies ChartConfig;

export function FiscalConsumptionLinechart({
  label,
  specificChart,
  descriptionRange,
}: {
  label: string;
  specificChart: SpecificAnalyticChart[];
  descriptionRange: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">
          {label ? `Consumo fiscal de ${label}` : "Seleccione una etiqueta"}
        </CardTitle>
        <CardDescription>{descriptionRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart
            accessibilityLayer
            data={specificChart}
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
              dataKey="average"
              type="monotone"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="amount"
              type="monotone"
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
