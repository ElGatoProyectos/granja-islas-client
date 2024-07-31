import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanyFetch } from "@/types";

const supplier = {
  id: 1,
  company_id: 5,
  user_id_created: 11,
  business_name: "example supplierzzzzz",
  business_type: "example type",
  business_status: "example status",
  business_direction: "direction example",
  description: null,
  ruc: "23454567599",
  status_deleted: false,
  created_at: "2024-07-24T00:00:00.000Z",
  updated_at: "2024-07-24T22:02:37.817Z",
  Company: {
    id: 5,
    business_name: "Test 1",
    business_type: "yjyjyyhnynynyn",
    business_status: "ggrrg",
    business_direction_fiscal: "dawda",
    description: "Description test1",
    user: "randomuser",
    phone: "",
    country_code: "hytjyjyjyjyj",
    ruc: "12345678932",
    key: "wafawdvadavd",
    status_deleted: false,
    created_at: "2024-07-24T00:00:00.000Z",
    updated_at: "2024-07-24T20:27:47.616Z",
  },
  User: {
    id: 11,
    role: "SUPERADMIN",
    name: "Super admin",
    last_name: "Test",
    phone: "909808903",
    country_code: null,
    email: "superadmin@gmail.com",
    dni: "12345678",
    status_enabled: true,
    status_deleted: false,
    created_at: "2024-07-23T00:00:00.000Z",
    updated_at: "2024-07-23T16:43:57.407Z",
  },
};

export function formatCompany(data: CompanyFetch) {
  const company = data;
  return {
    id: company.id,
    ruc: company.ruc,
    type: company.business_type,
    country_code: company.country_code,
    phone: company.phone,
    status: company.business_status,
    corporate_name: company.business_name,
    fiscal_address: company.business_direction,
  };
}

export default function Page({ params }: { params: { ruc: string } }) {
  const supplierData = formatCompany(supplier);
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
              <p className="text-foreground">{supplierData.corporate_name}</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>RUC</span>
              <p className="text-foreground">{supplierData.ruc}</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>Tipo</span>
              <p className="text-foreground">{supplierData.type}</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>Estado</span>
              <p className="text-foreground">{supplierData.status}</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>Dirección Fiscal</span>
              <p className="text-foreground">{supplierData.fiscal_address}</p>
            </div>
            <div className="flex flex-col font-medium w-full">
              <span>Celular</span>
              <p className="text-foreground">{supplierData.phone}</p>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
