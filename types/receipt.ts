export interface TypeReceipt {
  amount_base: number;
  amount_paid: number;
  amount_pending: number;
  bill_status: string;
  bill_status_payment: string;
  code: string;
  company_id: number;
  currency_code: string;
  exchange_rate: number;
  expiration_date: string | null;
  id: number;
  igv: number;
  issue_date: string | Date;
  num_cpe: number;
  num_serie: string;
  period: string;
  total: number;
  user_id_created: number;
  document_code: string;
  document_description: string;
  created_status: string;
  base_igv: number;
  supplier_id: number;
  supplier_name: string;
  supplier_ruc: string;
}
