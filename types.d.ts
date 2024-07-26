export type CompanyFetch = {
  id: number;
  ruc: string;
  business_type: string;
  country_code: string;
  phone: string;
  business_status: string;
  user: string;
  business_name: string;
  business_direction_fiscal: string;
  key: string;
};

export type FormattedCompany = {
  id: number;
  ruc: string;
  type: string;
  country_code: string;
  phone: string;
  status: string;
  user_sunnat: string;
  corporate_name: string;
  fiscal_address: string;
  password_sunnat: string;
};

export type RoleType = "SUPERADMIN" | "ADMIN" | "USER";
