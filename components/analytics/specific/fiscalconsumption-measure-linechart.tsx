"use client";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import { SpecificAnalyticChart } from "@/types/analytic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  amount: {
    label: "Gasto",
  },
  average: {
    label: "Promedio",
  },
} satisfies ChartConfig;

interface Props {
  label: string;
  descriptionRange: string;
  measures: string[];
  specificChart: SpecificAnalyticChart[];
}

export function FiscalConsumptionMeasureLinechart({
  label,
  specificChart,
  measures,
  descriptionRange,
}: Props) {
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const measure = searchParams.get("measure") ?? "";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">
          {label
            ? `Consumo fiscal de ${label} en Medida`
            : "Seleccione una etiqueta"}
        </CardTitle>
        <div className="flex gap-3 items-center">
          <CardDescription
            className={cn(
              "Seleccione un rango de periodos" !== descriptionRange
                ? "capitalize"
                : ""
            )}
          >
            {descriptionRange}
          </CardDescription>
          <Select
            value={measure}
            onValueChange={(value: string) => {
              push(pathname + "?" + createQueryString({ measure: value }));
            }}
          >
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Selecciona una medida" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Medidas</SelectLabel>
                {measures.map((measure) => (
                  <SelectItem
                    key={measure}
                    value={measure}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {measure}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] h-[300px]"
        >
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
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="amount"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="average"
              type="monotone"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
