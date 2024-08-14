"use client";

import { ReceiptsOfLabel } from "@/components/lists/label-detail";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocumentLabelProvider } from "@/context/sections/document-label-context";
import { useLabelDocuments } from "@/hooks/useLabelDocuments";
import { useLabels } from "@/hooks/useLabels";
import { Tag } from "lucide-react";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const { labels } = useLabels();
  const [filteredLabel] = labels.filter(
    (label) => label.id.toString() === (id as string)
  );

  useLabelDocuments({ labelId: id as string });

  return (
    <section>
      <Card>
        <CardHeader className="flex-row gap-4 items-center space-y-0">
          <CardTitle className="flex-row flex gap-2">
            {filteredLabel?.title} <Tag />
          </CardTitle>
          <CardDescription className="w-[75ch]">
            En esta sección, encontrarás una tabla detallada con todas las
            facturas relacionadas con la etiqueta de producto específico. La
            tabla te permite revisar de manera organizada cada transacción,
            facilitando el seguimiento y la gestión de tus compras.
          </CardDescription>
        </CardHeader>
      </Card>
      <DocumentLabelProvider>
        <ReceiptsOfLabel />
      </DocumentLabelProvider>
    </section>
  );
}
