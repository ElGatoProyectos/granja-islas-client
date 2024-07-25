import { CompanyType } from "@/lib/validations/auth/company";
import { CompanyFetch, FormattedCompany } from "@/types";

export function formatCompany(data: {
  payload: CompanyFetch[];
}): FormattedCompany[] {
  return data.payload.map((company) => ({
    id: company.id,
    ruc: company.ruc,
    type: company.business_type,
    country_code: company.country_code,
    phone: company.phone,
    status: company.business_status,
    user_sunnat: company.user,
    corporate_name: company.business_name,
    fiscal_address: company.business_direction_fiscal,
    password_sunnat: company.key,
  }));
}

export function unformatCompany(data: CompanyType) {
  return {
    ruc: data.ruc,
    business_type: data.type,
    country_code: data.country_code,
    phone: data.phone,
    business_status: data.status,
    user: data.user_sunnat,
    business_name: data.corporate_name,
    business_direction_fiscal: data.fiscal_address,
    key: data.password_sunnat,
  };
}
