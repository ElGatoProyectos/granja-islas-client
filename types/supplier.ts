import { TypeLabel } from "./label";

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

export interface TypeProductsOfSupplierTable {
  id: number;
  title: string;
  description: string | null;
  amount: number;
  price: number;
  igv: number | null;
  total: number | null;
  slug: string;
  unit_measure: string;
  supplier_id: number;
  issue_date: Date;
  document_type: string;
  document_id: number;
  document_type_code: string;
  status_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  product_labels: TypeLabel[];
  document_code: string;
  document_issue_date: Date;
}
