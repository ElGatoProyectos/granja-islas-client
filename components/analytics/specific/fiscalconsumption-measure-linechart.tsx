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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";
import { SpecificSchemaIN } from "@/lib/validations/analytics";

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
  date: string;
  measure: string[];
  measureSelect: string;
  setMeasureSelect: Dispatch<SetStateAction<string>>;
  specificChart: SpecificSchemaIN[];
}

export function FiscalConsumptionMeasureLinechart({
  label,
  date,
  measure,
  measureSelect,
  setMeasureSelect,
  specificChart,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Consumo fiscal de {label}</CardTitle>
        <div className="flex gap-3 items-center">
          <CardDescription>{date}</CardDescription>
          <Select value={measureSelect} onValueChange={setMeasureSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona una medida" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Medida</SelectLabel>
                {measure.map((measure) => (
                  <SelectItem key={measure} value={measure}>
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
