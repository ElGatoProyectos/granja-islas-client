import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createCompanySchema = z.object({
  image: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Tamaño maximo de 5mb.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Solo .jpg, .jpeg, .png and .webp formatos soportados."
    )
    .optional(),
  ruc: z.string().min(11, "El RUC es obligatorio."),
  business_name: z.string().min(1, "La razón social es obligatoria."),
  business_type: z.string().min(1, "El tipo es obligatorio."),
  business_status: z.string().min(1, "El estado es obligatorio."),
  business_direction_fiscal: z
    .string()
    .min(1, "La dirección fiscal es obligatoria."),
  country_code: z.string(),
  phone: z.string(),
  user: z.string().min(1, "El usuario Sunnat es obligatorio."),
  key: z.string().min(1, "La contraseña Sunnat es obligatoria."),
  client_id: z.string().min(1, "El id del cliente es obligatorio"),
  client_secret: z.string().min(1, "El secret del cliente es obligatorio"),
});
export type CreateCompanySchema = z.infer<typeof createCompanySchema>;

export const companySchemaIN = z.object({
  id: z.number(),
  ruc: z.string(),
  business_name: z.string(),
  business_type: z.string(),
  business_status: z.string(),
  business_direction_fiscal: z.string(),
  description: z.string().nullable(),
  country_code: z.string(),
  phone: z.string(),
  user: z.string(),
  key: z.string(),
  status_deleted: z.boolean(),
  client_id: z.string(),
  client_secret: z.string(),
  emisor_electronico_desde: z.date(),
  fecha_inscripcion: z.date(),
  fecha_inicio_actividades: z.date(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const companyArraySchemaIN = z.array(companySchemaIN);
export type CompanySchemaIN = z.infer<typeof companySchemaIN>;
