import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Etiqueta de productos</CardTitle>
        </CardHeader>
        <CardDescription>
          Asigna etiquetas para facilitar la búsqueda y organización de tus
          productos en las facturas. Agrega términos que describan el tipo de
          gasto, la categoría para crear filtros personalizados.
        </CardDescription>
      </Card>
    </section>
  );
}
