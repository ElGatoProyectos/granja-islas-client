import { PurchasesPerMoth } from "@/components/home/puchases-per-month";
import { SuppliersTable } from "@/components/home/suppliers-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cardsInfo = [
  {
    value: "3.1K",
    title: "Cantidad de Facturas",
    date: "30D",
  },
  {
    value: "S/.35,6K",
    title: "Valor de compras",
    date: "30D",
  },
  {
    value: "S/.1,5k",
    title: "Valor del IGV",
    date: "30D",
  },
  {
    value: "S/.37,1k",
    title: "Facturas totales",
    date: "30D",
  },
];

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

export default function Home() {
  return (
    <section>
      <h1 className="text-4xl font-bold ml-8">Panel de control</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {cardsInfo.map(({ value, title, date }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row justify-between space-y-0 pb-0">
              <span className="font-bold text-4xl">{value}</span>
              <span className="text-primary font-bold">{date}</span>
            </CardHeader>
            <CardContent>{title}</CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue={triggers[0].value} className="w-full mt-6">
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
            <div className="grid grid-cols-2 gap-x-4 h-[510px]">
              <Card>
                <CardHeader className="font-bold text-2xl">
                  Principales proveedores
                </CardHeader>
                <CardContent className="h-4/5">
                  <SuppliersTable suppliers={suppliers} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="font-bold text-2xl">
                  Compras del mes
                </CardHeader>
                <CardContent className="h-4/5">
                  <PurchasesPerMoth />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
