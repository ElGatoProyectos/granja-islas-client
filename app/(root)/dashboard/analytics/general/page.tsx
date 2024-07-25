import { ExpenseCompositionPiechart } from "@/components/analytics/general/expense-composition-piechart";
import { PurchasesPerMoth } from "@/components/analytics/general/puchases-per-month";
import { SuppliersBarchart } from "@/components/analytics/general/suppliers-barchart";
import { SuppliersTable } from "@/components/analytics/general/suppliers-table";
import { LayerPage } from "@/components/layer-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const triggers = [
  {
    value: "fuel",
    label: "Combustible",
  },
  {
    value: "diesel",
    label: "Combustible",
  },
  {
    value: "maiz",
    label: "Maiz",
  },
];

const contents = [
  {
    value: "fuel",
    header: "Combustible",
    suppliers: [
      {
        ruc: "10218473062",
        corporate_name: "Torres Barrios Juan Gilberto",
        country_code: "+51",
        phone: "987-519-513",
      },
      {
        ruc: "20127765279",
        corporate_name: "Coesti S.A.",
        country_code: "+51",
        phone: "998-519-333",
      },
      {
        ruc: "20452342236",
        corporate_name: "Taller De Soldadura Martinez E.I.R.L.",
        country_code: "+51",
        phone: "989-519-593",
      },
      {
        ruc: "20511995028",
        corporate_name: "Terpel Peru S.A.C.",
        country_code: "+51",
        phone: "977-519-883",
      },
    ],
  },
  {
    value: "diesel",
    header: "diesel",
    suppliers: [],
  },
  {
    value: "maiz",
    header: "maiz",
    suppliers: [],
  },
];

export default function Page() {
  return (
    <LayerPage title="Análisis por etiqueta">
      <Tabs defaultValue={triggers[0].value} className="w-full mt-6 h-full">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <TabsList className="flex w-max">
            {triggers.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {contents.map(({ value, suppliers }) => (
          <TabsContent key={value} value={value}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold">
                    Principales proveedores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SuppliersTable suppliers={suppliers} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold">Compras del mes</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <PurchasesPerMoth />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-6 w-full flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold ml-8 mb-6">
          Detalles generales
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <SuppliersBarchart />
          <ExpenseCompositionPiechart />
        </div>
      </div>
    </LayerPage>
  );
}
