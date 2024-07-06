import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre debe tener como máximo 50 caracteres"),
    lastname: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido debe tener como máximo 50 caracteres"),
    email: z
      .string()
      .email("El correo electrónico debe ser una dirección de correo válida")
      .min(2, "El correo electrónico debe tener al menos 2 caracteres")
      .max(100, "El correo electrónico debe tener como máximo 100 caracteres"),
    password: z
      .string()
      .max(100, "La contraseña debe tener como máximo 100 caracteres"),
    confirmPassword: z
      .string()
      .max(
        100,
        "La confirmación de la contraseña debe tener como máximo 100 caracteres"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
