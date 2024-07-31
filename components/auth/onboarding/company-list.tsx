"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { backend_url } from "@/constants/config";
import { FormattedCompany } from "@/types";
import { CompanyForm } from "./company-form";
import { CompanyDelete } from "./company-delete";
import { useCompanySession } from "@/context/company-context";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/context/user-context";
import { USER } from "@/constants/roles";

export function CompanyList({ companies }: { companies?: FormattedCompany[] }) {
  const { setCompany } = useCompanySession();
  const route = useRouter();
  const { userInfo } = useUserInfo();

  const handleCompany = ({ company }: { company: FormattedCompany }) => {
    setCompany(company);
    if (userInfo?.role === USER) {
      route.push("/payments");
      return;
    }
    route.push("/dashboard");
  };
  return (
    <>
      {companies?.map((company) => (
        <div key={company.ruc} className="relative group">
          <Card
            className="border-0 cursor-pointer"
            onClick={() => handleCompany({ company })}
          >
            <CardHeader className="flex-row justify-start items-center space-y-0 p-0 h-[82px]">
              <img
                src={`${backend_url}/api/companies/file/${company.id}`}
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
            <CompanyForm type="edit" company={company} companyId={company.id} />

            <CompanyDelete
              ruc={company.ruc}
              corporate_name={company.corporate_name}
              companyId={company.id}
            />
          </div>
        </div>
      ))}
    </>
  );
}
