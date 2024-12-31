import z from "zod"

export const SignUpSchema = z.object({
    username: z.string({ message: "Username is required" }).min(2, { message: "Username is required" }),
    email: z.string({ message: "Email is required" }).email({ message: "Email is invalid" }),
    password: z.string({ message: "Password is required" }).min(9, { message: "Password is required" })
})

export type signUpPayload = z.infer<typeof SignUpSchema>