import { z } from "zod";

export const loginSchema = z.object({
  Correo: z.string().email({
    message: "Please enter a valid email address",
  }),
  Contrasena: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const registerSchema = z
  .object({
    Nombre: z
      .string({
        required_error: "Username is required",
      })
      .min(3, {
        message: "Username must be at least 3 characters",
      }),
    Correo: z.string().email({
      message: "Please enter a valid email address",
    }),
    Contrasena: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    confirmContrasena: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  })
  .refine((data) => data.Contrasena === data.confirmContrasena, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
