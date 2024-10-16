import { TypeLabel } from "./label";
import { TypeSupplier } from "./supplier";

export interface TypeProduct {
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
  issue_date: string;
  document_type: string;
  document_id: number;
  status_deleted: boolean;
  created_at: string;
  updated_at: string;
  Supplier: TypeSupplier;
}

export interface TypeProductTable {
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
  issue_date: string;
  document_type: string;
  document_id: number;
  status_deleted: boolean;
  created_at: string;
  updated_at: string;
  Supplier: TypeSupplier;
  document_code: string;
  code: string;
  labels: TypeLabel[];
}

export interface TypeProductTableFormat {
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
  supplier_name: string;
  issue_date: string;
  document_type: string;
  document_id: number;
  status_deleted: boolean;
  created_at: string;
  updated_at: string;
  document_code: string;
  code: string;
  labels: TypeLabel[];
}
