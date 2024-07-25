export type CompanyFetch = {
  id: string;
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
  id: string;
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
