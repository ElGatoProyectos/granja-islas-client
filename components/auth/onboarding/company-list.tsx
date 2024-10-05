"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { BACKEND_URL } from "@/constants/config";
import { CompanyForm } from "./company-form";
import { CompanyDelete } from "./company-delete";
import { useCompanySession } from "@/context/company-context";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/context/user-context";
import { SUPERADMIN, USER } from "@/constants/roles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CompanySchemaIN } from "@/lib/validations/auth/company";
import { useQueryParams } from "@/hooks/useQueryParams";

export function CompanyList({ companies }: { companies?: CompanySchemaIN[] }) {
  const { setCompany } = useCompanySession();
  const route = useRouter();
  const { userInfo } = useUserInfo();
  const { createQueryString } = useQueryParams();

  const handleCompany = ({ company }: { company: CompanySchemaIN }) => {
    setCompany(company);
    const queryString = createQueryString({ ruc: company.ruc });
    if (userInfo?.role === USER) {
      route.push(`/receipts?${queryString}`);
      return;
    }
    route.push(`/dashboard?${queryString}`);
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
              <Avatar className={"h-10 w-10 mr-3"}>
                <AvatarImage
                  src={`${BACKEND_URL}/api/companies/file/${
                    company.id
                  }?t=${new Date().getTime()}`}
                  className="object-cover"
                />
                <AvatarFallback>
                  {company.business_name.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-sm capitalize">
                  {company.business_name.toLowerCase()}
                </h3>
                <p className="text-gray-500 text-sm">{company.ruc}</p>
              </div>
            </CardHeader>
          </Card>
          {userInfo?.role === SUPERADMIN && (
            <div className="absolute top-0 -right-10 flex flex-col justify-center group-hover:opacity-100 opacity-0 transition-opacity">
              <CompanyForm
                type="edit"
                company={company}
                companyId={company.id}
              />

              <CompanyDelete
                ruc={company.ruc}
                corporate_name={company.business_name}
                companyId={company.id}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
