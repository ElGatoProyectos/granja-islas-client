import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page({ params }: { params: { ruc: string } }) {
  return (
    <section>
      <Card>
        <CardHeader className="flex-row gap-8">
          <CardTitle className="max-w-32 font-bold">
            Detalles de proveedor
          </CardTitle>
          <CardDescription className="flex gap-6 w-full flex-1">
            <div className="flex flex-col font-medium w-full">
              <span>Razón social</span>
              <p className="text-foreground">{params.ruc}</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>RUC</span>
              <p className="text-foreground">232</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>Tipo</span>
              <p className="text-foreground">23</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>Estado</span>
              <p className="text-foreground">23</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>Dirección Fiscal</span>
              <p className="text-foreground">23</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>Celular</span>
              <p className="text-foreground">23</p>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
