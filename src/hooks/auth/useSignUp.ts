import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SignUpSchema, signUpPayload } from "@/schema/signUpSchema"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import { StatusCodes } from 'http-status-codes';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"

export const useSignUp = () => {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const form = useForm<signUpPayload>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = async (payload: signUpPayload) => {
        try {
            const res = await axios.post("/api/auth/signup/", payload)
            if (res.status === StatusCodes.CREATED) {
                toast({
                    title: res.data.message,
                    variant: "default",
                    className: "bg-green-500 rounded-xl",
                    duration: 3000,
                });
                await signIn("credentials", {
                    email: res.data.data.email,
                    password: res.data.data.password,
                    redirect: false,
                });
                router.push("/");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.status) {
                    case StatusCodes.UNAUTHORIZED:
                        return toast({
                            title: "Authentication Error",
                            description: error.response?.data.message,
                            variant: "destructive",
                            duration: 3000,
                        })
                    case StatusCodes.CONFLICT:
                        return toast({
                            title: "Authentication Error",
                            description: error.response?.data.message,
                            variant: "destructive",
                            duration: 3000,
                        })
                    case StatusCodes.INTERNAL_SERVER_ERROR:
                        return toast({
                            title: "Authentication Error",
                            description: error.response?.data.message,
                            variant: "destructive",
                            duration: 3000,
                        })
                    case StatusCodes.INTERNAL_SERVER_ERROR:
                        return toast({
                            title: "Authentication Error",
                            description: error.response?.data.message,
                            variant: "destructive",
                            duration: 3000,
                        })
                    default:
                        return toast({
                            title: "Something went wrong while signing up",
                            variant: "destructive",
                            duration: 3000,
                        })
                }
            }
        }
    }

    return { onSubmit, form, isLoading, setIsLoading }
}