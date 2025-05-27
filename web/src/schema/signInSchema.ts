import { z } from "zod";

export const password = z
    .string()
    .refine((password) => password.length >= 6, {
        message: "SCHEMA.PASSWORD.MIN",
    })
    .refine((password) => /[A-Z]/.test(password), {
        message: "SCHEMA.PASSWORD.UPPERCASE",
    })
    .refine((password) => /[a-z]/.test(password), {
        message: "SCHEMA.PASSWORD.LOWERCASE",
    })
    .refine((password) => /\d/.test(password), {
        message: "SCHEMA.PASSWORD.DIGIT",
    });

export const SignInSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password must be at least 1 characters"),
});

export type signInPayload = z.infer<typeof SignInSchema>;