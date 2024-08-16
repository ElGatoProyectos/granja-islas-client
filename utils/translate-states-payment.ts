import { APPROVED, PENDING, REFUSED } from "@/constants/status-payment";

export function translateStatus(status: string) {
  switch (status) {
    case PENDING:
      return "Pendiente";
    case APPROVED:
      return "Aprobado";
    case REFUSED:
      return "Rechazado";
    default:
      return "Estado desconocido";
  }
}
