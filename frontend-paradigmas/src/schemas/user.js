import { z } from "zod";

export const editSchema = z
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
    })
