import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .email("Debe ser una dirección de correo válida")
    .max(100, "Debe tener como máximo 100 caracteres"),
  password: z.string().max(100, "Debe tener como máximo 100 caracteres"),
});
