"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GeneralTopSupplier } from "@/types/analytic";
import { Tag } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

interface Props {
  topSuppliers: GeneralTopSupplier[];
  descriptionRange: string;
}

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function SuppliersBarchart({ topSuppliers, descriptionRange }: Props) {
  const top5Suppliers = topSuppliers.slice(0, 5);
  const dataWithColors = top5Suppliers.map((item, index) => ({
    ...item,
    fill: colors[index],
  }));
  const chartConfig = {
    total: {
      label: "Gasto total",
    },
    [top5Suppliers[0]?.business_name]: {
      label: top5Suppliers[0]?.business_name.toLowerCase(),
    },
    [top5Suppliers[1]?.business_name]: {
      label: top5Suppliers[1]?.business_name.toLowerCase(),
    },
    [top5Suppliers[2]?.business_name]: {
      label: top5Suppliers[2]?.business_name.toLowerCase(),
    },
    [top5Suppliers[3]?.business_name]: {
      label: top5Suppliers[3]?.business_name.toLowerCase(),
    },
    [top5Suppliers[4]?.business_name]: {
      label: top5Suppliers[4]?.business_name.toLowerCase(),
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center space-y-0">
        <CardTitle className="font-bold">Proveedores</CardTitle>
        <CardDescription>{descriptionRange}</CardDescription>
      </CardHeader>
      <CardContent>
        {topSuppliers.length ? (
          <ChartContainer config={chartConfig} className="aspect-video">
            <BarChart
              accessibilityLayer
              data={dataWithColors}
              layout="vertical"
              margin={{
                left: 0,
              }}
            >
              <YAxis
                dataKey="business_name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={160}
                className="capitalize text-balance"
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
              <XAxis dataKey="total" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Bar dataKey="total" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="my-10 flex justify-center items-center">
            <Link
              href="/dashboard/products"
              className={`${buttonVariants({
                variant: "link",
              })}, !p-0 text-balance`}
            >
              <Tag className="w-6 h-6 mr-3" />
              Debes etiquetar un producto para poder visualizar las estadisticas
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
