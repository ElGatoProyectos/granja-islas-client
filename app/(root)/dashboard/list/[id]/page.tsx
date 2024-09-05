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
        <CardHeader className="items-center">
          <CardTitle className="flex-row flex gap-2">
            <Tag />
            {filteredLabel?.title}
          </CardTitle>
          <CardDescription className="w-[75ch] text-center">
            En esta sección, encontrarás una tabla detallada con todas las
            facturas relacionadas con la etiqueta de producto específico. La
            tabla te permite revisar de manera organizada cada transacción.
          </CardDescription>
        </CardHeader>
      </Card>
      <DocumentLabelProvider>
        <ReceiptsOfLabel />
      </DocumentLabelProvider>
    </section>
  );
}
