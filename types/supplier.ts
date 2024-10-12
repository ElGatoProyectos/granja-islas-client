export interface TypeSupplier {
  id: number;
  ruc: string;
  business_name: string;
  business_type: string;
  business_status: string;
  business_direction: string;
  country_code: string | null;
  phone: string | null;
}
