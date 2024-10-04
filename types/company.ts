export interface TypeCompany {
  id: number;
  ruc: string;
  business_name: string;
  business_type: string;
  business_status: string;
  business_direction_fiscal: string;
  description: string | null;
  country_code: string;
  phone: string;
  user: string;
  key: string;
  status_deleted: boolean;
  client_id: string;
  client_secret: string;
  emisor_electronico_desde: Date;
  fecha_inscripcion: Date;
  fecha_inicio_actividades: Date;
  created_at: string;
  updated_at: string;
}
