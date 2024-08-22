export const PENDING = "PENDING";
export const APPROVED = "APPROVED";
export const REFUSED = "REFUSED";
export const status_payment = [PENDING, APPROVED, REFUSED];
export const statusPayment_formatSpanish = [
  {
    value: PENDING,
    label: "Pendiente",
  },
  {
    value: APPROVED,
    label: "Aprobado",
  },
  {
    value: REFUSED,
    label: "Rechazado",
  },
];
