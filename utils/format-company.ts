import { CompanyType } from "@/lib/validations/auth/company";
import { CompanyFetch, FormattedCompany } from "@/types";

export function formatCompanies(data: {
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

export function formatCompany(data: {
  payload: CompanyFetch;
}): FormattedCompany {
  console.log("");
  const company = data.payload;
  return {
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
  };
}

export function unformatCompany(data: CompanyType) {
  return {
    business_type: data.type,
    business_name: data.corporate_name,
    business_direction_fiscal: data.fiscal_address,
    business_status: data.status,
    country_code: data.country_code,
    ruc: data.ruc,
    key: data.password_sunnat,
    user: data.user_sunnat,
    phone: data.phone,
  };
}
