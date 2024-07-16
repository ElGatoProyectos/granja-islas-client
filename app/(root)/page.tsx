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
    header: "header combustible",
    content: "content combustible",
  },
  {
    value: "diesel",
    header: "header diesel",
    content: "content diesel",
  },
  {
    value: "maiz",
    header: "header maiz",
    content: "content maiz",
  },
];

export default function Home() {
  return (
    <section>
      <h1 className="text-4xl font-bold">Panel de control</h1>
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
      <Tabs defaultValue={triggers[0].value} className="w-full mt-10">
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
        {contents.map(({ value, content, header }) => (
          <TabsContent key={value} value={value}>
            <Card>
              <CardHeader>{header}</CardHeader>
              <CardContent className="space-y-2">{content}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
