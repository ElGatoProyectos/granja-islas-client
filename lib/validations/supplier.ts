import { countryCodes } from "@/constants/country-code";
import { z } from "zod";

const countryIsoCodes = countryCodes.map((entry) => entry.code);
export const supplierSchema = z.object({
  ruc: z.string().min(1, "El RUC es obligatorio."),
  corporate_name: z.string().min(1, "La razón social es obligatoria."),
  type: z.string().min(1, "El tipo es obligatorio."),
  status: z.string().min(1, "El estado es obligatorio."),
  fiscal_address: z.string().min(1, "La dirección fiscal es obligatoria."),
  country_code: z.string(),
  phone: z.string(),
});

export type SupplierType = z.infer<typeof supplierSchema>;
