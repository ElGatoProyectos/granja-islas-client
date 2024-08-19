"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Dispatch, SetStateAction } from "react";
import { TopSuppliersSchemaIN } from "@/lib/validations/analytics";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Tag } from "lucide-react";

interface Props {
  radio: string;
  setRadio: Dispatch<SetStateAction<string>>;
  topSuppliers: TopSuppliersSchemaIN[];
}

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function SuppliersBarchart({ setRadio, radio, topSuppliers }: Props) {
  const dates_radio = [
    {
      id: crypto.randomUUID(),
      value: "1",
      label: "1M",
    },
    {
      id: crypto.randomUUID(),
      value: "6",
      label: "6M",
    },
    {
      id: crypto.randomUUID(),
      value: "12",
      label: "1A",
    },
  ];
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
      label: top5Suppliers[0]?.business_name,
    },
    [top5Suppliers[1]?.business_name]: {
      label: top5Suppliers[1]?.business_name,
    },
    [top5Suppliers[2]?.business_name]: {
      label: top5Suppliers[2]?.business_name,
    },
    [top5Suppliers[3]?.business_name]: {
      label: top5Suppliers[3]?.business_name,
    },
    [top5Suppliers[4]?.business_name]: {
      label: top5Suppliers[4]?.business_name,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center space-y-0">
        <CardTitle className="font-bold">Proveedores</CardTitle>
        <RadioGroup
          className="grid-cols-3 gap-1"
          value={radio}
          onValueChange={setRadio}
        >
          {dates_radio.map(({ value, label, id }) => (
            <div key={label} className="flex items-center justify-center ">
              <RadioGroupItem value={value} id={id} className="sr-only" />
              <Label htmlFor={id} className="cursor-pointer">
                <Badge
                  variant={radio === value ? "default" : "outline"}
                  className="px-5 py-[5px] text-sm"
                >
                  {label}
                </Badge>
              </Label>
            </div>
          ))}
        </RadioGroup>
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
                width={150}
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
