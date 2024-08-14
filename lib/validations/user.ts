import { countryCodes } from "@/constants/country-code";
import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const countryIsoCodes = countryCodes.map((entry) => entry.code);
export const userSchema = z
  .object({
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
    name: z.string().min(1, "El nombre es obligatorio."),
    last_name: z.string().min(1, "El apellido es obligatorio."),
    email: z.string().min(1, "El correo es obligatorio."),
    role: z.enum(["SUPERADMIN", "ADMIN", "USER"]),
    country_code: z
      .string()
      .min(1, "El código de país es obligatorio.")
      .refine(
        (code) => countryIsoCodes.includes(code),
        "Código de país inválido."
      )
      .optional(),
    phone: z
      .string()
      .min(1, "El número de teléfono es obligatorio.")
      .refine(
        (phone) => /^\d+$/.test(phone),
        "El número de teléfono debe contener solo dígitos."
      )
      .optional(),
    password: z
      .string()
      .max(30, "La contraseña debe tener como máximo 30 caracteres"),
    confirmPassword: z
      .string()
      .max(
        30,
        "La confirmación de la contraseña debe tener como máximo 30 caracteres"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type UserType = z.infer<typeof userSchema>;

export const userSchemaIN = z.object({
  id: z.number(),
  name: z.string(),
  last_name: z.string(),
  email: z.string(),
  role: z.enum(["SUPERADMIN", "ADMIN", "USER"]),
  country_code: z.string().nullable(),
  phone: z.string().nullable(),
});
export const userArraySchemaIN = z.array(userSchemaIN);
export type UserSchemaIN = z.infer<typeof userSchemaIN>;
