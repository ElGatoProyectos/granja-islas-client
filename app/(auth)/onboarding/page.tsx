import { CompanyDelete } from "@/components/auth/onboarding/company-delete";
import { CompanyForm } from "@/components/auth/onboarding/company-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getCompanies } from "@/lib/actions/company.actions";
import { Pencil, Plus, Trash } from "lucide-react";

const companys = [
  {
    ruc: "20535014940",
    corporate_name: "Empresa de Transporte Don Agusto",
  },
  {
    ruc: "61868881388",
    corporate_name: "Empresa de Maiz Don Pedro",
  },
  {
    ruc: "89165185168",
    corporate_name: "Empresa de Eventos Don Javier",
  },
];

export default async function Page() {
  const companies = await getCompanies();
  console.log("data", companies);
  return (
    <div className="h-dvh flex justify-center items-center">
      <section className="flex flex-col max-w-[450px] sm:p-12 bg-white rounded-xl relative shadow-lg">
        <header className="flex flex-col mb-3">
          <h1 className="text-2xl sm:text-4xl font-bold">Elegir Empresa</h1>
          <p className="text-gray-500 leading-tight text-sm mt-2">
            Esta selección te permitirá acceder a toda la información
            relacionada con el RUC elegido, como proveedores, compras,
            transacciones y más.
          </p>
        </header>

        {companies?.map((company) => (
          <div key={company.ruc} className="relative group">
            <Card className="border-0 cursor-pointer">
              <CardHeader className="flex-row justify-start items-center space-y-0 p-0 h-[82px]">
                <img
                  src="/assets/photo-bussines.png"
                  alt="photo-bussines"
                  className="rounded-full h-10 w-10 mr-3"
                />
                <div className="flex flex-col justify-center">
                  <h3 className="font-semibold text-sm">
                    {company.corporate_name}
                  </h3>
                  <p className="text-gray-500 text-sm">{company.ruc}</p>
                </div>
              </CardHeader>
            </Card>
            <div className="absolute top-0 -right-10 flex flex-col justify-center group-hover:opacity-100 opacity-0 transition-opacity">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="stroke-primary" />
                    <span className="sr-only">Editar empresa</span>
                  </Button>
                </DialogTrigger>
                <CompanyForm type="edit" company={company} />
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash className="stroke-red-500" />
                    <span className="sr-only">Borrar empresa</span>
                  </Button>
                </DialogTrigger>
                <CompanyDelete
                  ruc={company.ruc}
                  corporate_name={company.corporate_name}
                />
              </Dialog>
            </div>
          </div>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="hover:text-primary mt-2">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Empresa
            </Button>
          </DialogTrigger>
          <CompanyForm type="create" />
        </Dialog>
      </section>
    </div>
  );
}
