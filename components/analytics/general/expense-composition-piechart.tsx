"use client";

import { Label as LabelRechart, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ExpCompositonSchemaIN } from "@/lib/validations/analytics";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Tag } from "lucide-react";

interface Props {
  expComposition: ExpCompositonSchemaIN[];
  descriptionRange: string;
}

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function ExpenseCompositionPiechart({
  expComposition,
  descriptionRange,
}: Props) {
  const expCompositionTop5 = expComposition.slice(0, 5);
  const dataWithColors = expCompositionTop5.map((item, index) => ({
    ...item,
    fill: colors[index],
  }));
  const totalExpense = useMemo(() => {
    return dataWithColors.reduce((acc, curr) => acc + curr.total, 0);
  }, [dataWithColors]);

  const chartConfig = {
    total: {
      label: "Gastos",
    },
    [expCompositionTop5[0]?.label]: {
      label: expCompositionTop5[0]?.label,
    },
    [expCompositionTop5[1]?.label]: {
      label: expCompositionTop5[1]?.label,
    },
    [expCompositionTop5[2]?.label]: {
      label: expCompositionTop5[2]?.label,
    },
    [expCompositionTop5[3]?.label]: {
      label: expCompositionTop5[3]?.label,
    },
    [expCompositionTop5[4]?.label]: {
      label: expCompositionTop5[4]?.label,
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row justify-between items-center space-y-0">
        <CardTitle className="font-bold">Composición de gasto</CardTitle>
        <CardDescription>{descriptionRange}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {expComposition.length ? (
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
                data={dataWithColors}
                dataKey="total"
                nameKey="label"
                innerRadius={80}
                strokeWidth={5}
              >
                <LabelRechart
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
