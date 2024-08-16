"use client";

import { ShoppingRecordTable } from "@/components/home/shopping-record-table";
import { LayerPage } from "@/components/layer-page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { formatWithCommas } from "@/utils/format-number-comas";

export default function Home() {
  const { receipts, setMonth, setYear, loading, cardsInfo } = useDashboard();
  console.log(receipts);
  return (
    <LayerPage title="Registro de compras">
      <ScrollArea className="w-[calc(100vw-3.75rem)] lg:w-full whitespace-nowrap rounded-md">
        {loading ? (
          <div className="flex w-max pb-6 lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:w-full gap-4 justify-center items-center">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="flex w-max pb-6 lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:w-full gap-4">
            {cardsInfo.map(({ value, title, date }) => (
              <Card key={title}>
                <CardHeader className="flex flex-row justify-between space-y-0 pb-0">
                  <span className="font-bold text-4xl">
                    {formatWithCommas(value)}
                  </span>
                  <span className="text-primary font-bold">{date}</span>
                </CardHeader>
                <CardContent>{title}</CardContent>
              </Card>
            ))}
          </div>
        )}

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ShoppingRecordTable
        setMonth={setMonth}
        setYear={setYear}
        receipts={receipts}
        loading={loading}
        totalAmountofAll={cardsInfo.length ? cardsInfo[3].value : 0}
      />
    </LayerPage>
  );
}
