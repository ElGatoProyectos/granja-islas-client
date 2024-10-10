import { formatWithCommas } from "@/utils/format-number-comas";
import { Card, CardContent, CardHeader } from "../ui/card";

interface TypeCardsInfo {
  value: number;
  title: "Numero de documentos" | "Base imponible" | "IGV" | "Compras totales";
  date: "1M";
}

export function CardsInfo({ cardsInfo }: { cardsInfo: TypeCardsInfo[] }) {
  return (
    <div className="flex w-max lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:w-full gap-4">
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
  );
}
