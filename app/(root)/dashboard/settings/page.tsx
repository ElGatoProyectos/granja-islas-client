import { BankForm } from "@/components/settings/bank-form";
import { LabelForm } from "@/components/settings/label-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <section className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Etiqueta de productos</CardTitle>
          <CardDescription>
            Asigna etiquetas para facilitar la búsqueda y organización de tus
            productos en las facturas. Agrega términos que describan la
            categoría para crear filtros personalizados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LabelForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Bancos</CardTitle>
          <CardDescription>
            Gestiona y visualiza información sobre tus bancos asociados. Agrega
            nuevas etiquetas para clasificar y organizar tus datos de manera
            eficiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BankForm />
        </CardContent>
      </Card>
    </section>
  );
}
