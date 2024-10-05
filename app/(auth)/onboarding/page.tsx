import { CompanyForm } from "@/components/auth/onboarding/company-form";
import { CompanyList } from "@/components/auth/onboarding/company-list";
import { getCompanies } from "@/lib/actions/company.actions";

export default async function Page() {
  const companies = await getCompanies();

  return (
    <div className="h-dvh flex justify-center items-center">
      <section className="flex flex-col max-w-[450px] sm:p-12 bg-background border border-border rounded-xl relative shadow-lg">
        <header className="flex flex-col mb-3">
          <h1 className="text-2xl sm:text-4xl font-bold">Elegir Empresa</h1>
          <p className="text-muted-foreground leading-tight text-sm mt-2">
            {companies?.length === 0 ? (
              <>
                Da el primer paso creando tu empresa. ¡Estamos aquí para
                ayudarte a gestionar todo fácilmente!
              </>
            ) : (
              <>
                Esta selección te permitirá acceder a toda la información
                relacionada con el RUC elegido, como proveedores, compras,
                transacciones y más.
              </>
            )}
          </p>
        </header>
        <CompanyList companies={companies} />
        <CompanyForm type="create" />
      </section>
    </div>
  );
}
