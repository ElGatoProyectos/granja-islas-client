import { format } from "date-fns";

export function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
}
