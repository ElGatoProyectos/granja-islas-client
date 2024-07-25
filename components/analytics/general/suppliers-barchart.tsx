"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RadioDates } from "@/components/radio-dates";

const chartSuppliers = [
  {
    ruc: "10218473062",
    corporate_name: "Torres Barrios Juan Gilberto",
    expense_by_supplier: 95115,
    fill: "hsl(var(--chart-1))",
  },
  {
    ruc: "20127765279",
    corporate_name: "Coesti S.A.",
    expense_by_supplier: 81615,
    fill: "hsl(var(--chart-2))",
  },
  {
    ruc: "20452342236",
    corporate_name: "Taller De Soldadura Martinez E.I.R.L.",
    expense_by_supplier: 51645,
    fill: "hsl(var(--chart-3))",
  },
  {
    ruc: "20511995028",
    corporate_name: "Terpel Peru S.A.C.",
    expense_by_supplier: 9000,
    fill: "hsl(var(--chart-4))",
  },
  {
    ruc: "",
    corporate_name: "Otros",
    expense_by_supplier: 4535,
    fill: "hsl(var(--chart-5))",
  },
];

const chartConfig = {
  expense_by_supplier: {
    label: "Gasto total",
  },
  [chartSuppliers[0].corporate_name]: {
    label: chartSuppliers[0].corporate_name,
  },
  [chartSuppliers[1].corporate_name]: {
    label: chartSuppliers[1].corporate_name,
  },
  [chartSuppliers[2].corporate_name]: {
    label: chartSuppliers[2].corporate_name,
  },
  [chartSuppliers[3].corporate_name]: {
    label: chartSuppliers[3].corporate_name,
  },
  [chartSuppliers[4].corporate_name]: {
    label: chartSuppliers[4].corporate_name,
  },
} satisfies ChartConfig;

export function SuppliersBarchart() {
  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center space-y-0">
        <CardTitle className="font-bold">Proveedores</CardTitle>
        <RadioDates />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-video">
          <BarChart
            accessibilityLayer
            data={chartSuppliers}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="corporate_name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={150}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="expense_by_supplier" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="expense_by_supplier" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
