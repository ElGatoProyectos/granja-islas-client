export interface TypeLabel {
  id: number;
  company_id: number;
  user_created_id: number;
  title: string;
  slug: string;
  description: string | null;
  status_deleted: boolean;
}
