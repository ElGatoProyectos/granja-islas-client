"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RadioDates } from "@/components/radio-dates";

const chartExpenseComposition = [
  {
    label: "Maiz",
    expense: 516165,
    fill: "hsl(var(--chart-1))",
  },
  {
    label: "Soya",
    expense: 516000,
    fill: "hsl(var(--chart-2))",
  },
  {
    label: "Gallinas",
    expense: 405565,
    fill: "hsl(var(--chart-3))",
  },
  {
    label: "Diesel",
    expense: 300000,
    fill: "hsl(var(--chart-4))",
  },

  {
    label: "Otros",
    expense: 200000,
    fill: "hsl(var(--chart-5))",
  },
];

const chartConfig = {
  expense: {
    label: "Gastos",
  },
  [chartExpenseComposition[0].label]: {
    label: chartExpenseComposition[0].label,
  },
  [chartExpenseComposition[1].label]: {
    label: chartExpenseComposition[1].label,
  },
  [chartExpenseComposition[2].label]: {
    label: chartExpenseComposition[2].label,
  },
  [chartExpenseComposition[3].label]: {
    label: chartExpenseComposition[3].label,
  },
  [chartExpenseComposition[4].label]: {
    label: chartExpenseComposition[4].label,
  },
} satisfies ChartConfig;

export function ExpenseCompositionPiechart() {
  const totalExpense = React.useMemo(() => {
    return chartExpenseComposition.reduce((acc, curr) => acc + curr.expense, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row justify-between items-center space-y-0">
        <CardTitle className="font-bold">Composición de gasto</CardTitle>
        <RadioDates />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[320px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartExpenseComposition}
              dataKey="expense"
              nameKey="label"
              innerRadius={80}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalExpense.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Gastos Totales
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
