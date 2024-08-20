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
import { Specific3Formated } from "@/hooks/useAnalyticsSpecific";
import { formatWithCommas } from "@/utils/format-number-comas";

const chartConfig = {
  shopping: {
    label: "Gasto",
  },
} satisfies ChartConfig;

interface Props {
  label: string;
  date: string;
  specificChart3: Specific3Formated[];
}

export function LastShoppingLinechart({ label, date, specificChart3 }: Props) {
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
            data={specificChart3}
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
              tickFormatter={formatWithCommas}
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
