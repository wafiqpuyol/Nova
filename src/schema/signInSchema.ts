import z from "zod"

export const SignInSchema = z.object({
    username: z.string({ message: "Username is required" }).min(2, { message: "Username is required" }),
    email: z.string({ message: "Email is required" }).email({ message: "Email is invalid" }),
    password: z.string({ message: "Password is required" }).min(1, { message: "Password is required" })
})