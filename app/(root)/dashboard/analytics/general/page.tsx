"use client";

import { ExpenseCompositionPiechart } from "@/components/analytics/general/expense-composition-piechart";
import { PurchasesPerMoth } from "@/components/analytics/general/puchases-per-month";
import { SuppliersBarchart } from "@/components/analytics/general/suppliers-barchart";
import { SuppliersTable } from "@/components/analytics/general/suppliers-table";
import { LayerPage } from "@/components/layer-page";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalyticsGeneral } from "@/hooks/useAnalyticsGeneral";
import { useLabels } from "@/hooks/useLabels";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const { labels } = useLabels();
  const {
    setLabelId,
    generalAnalytics,
    labelId,
    setRadio,
    radio,
    topSuppliers,
    monthRadio,
    setMonthRadio,
    expComposition,
  } = useAnalyticsGeneral();

  useEffect(() => {
    if (labels.length) {
      setLabelId(labels[0].id.toString());
    }
  }, [labels, setLabelId]);
  console.log(topSuppliers);
  return (
    <LayerPage title="Análisis por etiqueta">
      <Tabs className="w-full mt-6 h-full" value={labelId}>
        {labels.length ? (
          <ScrollArea className="w-[calc(100vw-4rem)] lg:w-[calc(100vw-20rem)] whitespace-nowrap rounded-md pb-3">
            <TabsList className="flex w-max">
              {labels.map(({ id, title }) => (
                <TabsTrigger
                  key={id}
                  value={id.toString()}
                  onClick={() => {
                    setLabelId(id.toString());
                  }}
                  className="hover:bg-background/30"
                >
                  {title}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <Link
            href="/dashboard/settings"
            className={buttonVariants({ variant: "link" })}
          >
            Crea una etiqueta para comenzar
          </Link>
        )}

        <TabsContent value={labelId ?? ""}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">
                  Principales proveedores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SuppliersTable
                  suppliers={generalAnalytics?.principalSuppliers}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">Compras por mes</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <PurchasesPerMoth buyforMonth={generalAnalytics?.buyForMonth} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-6 w-full flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold ml-8 mb-6">
          Detalles generales
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <SuppliersBarchart
            setRadio={setRadio}
            radio={radio}
            topSuppliers={topSuppliers}
          />
          <ExpenseCompositionPiechart
            monthRadio={monthRadio}
            setMonthRadio={setMonthRadio}
            expComposition={expComposition}
          />
        </div>
      </div>
    </LayerPage>
  );
}
