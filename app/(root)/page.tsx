import { LayerPage } from "@/components/layer-page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const cardsInfo = [
  {
    value: "500",
    title: "Numero de documentos",
    date: "1M",
  },
  {
    value: "S/225,000",
    title: "Base imponible",
    date: "1M",
  },
  {
    value: "S/40,500",
    title: "IGV",
    date: "1M",
  },
  {
    value: "S/265,500",
    title: "Compras totales",
    date: "1M",
  },
];

export default function Home() {
  return (
    <LayerPage title="Registro de compras">
      <ScrollArea className="w-[calc(100vw-3.75rem)] lg:w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 pb-6 lg:grid lg:grid-cols-4 lg:w-full">
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </LayerPage>
  );
}
