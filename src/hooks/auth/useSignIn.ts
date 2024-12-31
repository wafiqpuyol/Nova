import { signInPayload, SignInSchema } from "@/schema/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { useToast } from "../use-toast";
import { DEFAULT_ERR_MSG } from "@/lib/constant";

export const useSignIn = () => {
    const form = useForm<signInPayload>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data: signInPayload) => {
        setIsLoading(true);
        console.log("auth data =>", data);
        try {
            const signInInfo = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            console.log(signInInfo);
            if (!signInInfo) throw new Error("Something went wrong while signing in")
            if (signInInfo.error) {
                toast({
                    title: "Authentication Error",
                    description: signInInfo.error,
                    variant: "destructive",
                    duration: 3000,
                });
            }
            if (signInInfo.ok) {
                toast({
                    title: "You have been logged in!",
                    duration: 3000,
                });
                router.push("/onboarding");
                router.refresh();
            }
        } catch (err) {
            let errMsg = DEFAULT_ERR_MSG;
            if (err instanceof Error) errMsg = err.message;
            toast({
                title: "Authentication Error",
                description: errMsg,
                variant: "destructive",
                duration: 3000,
            });
        }
        setIsLoading(false);
    };

    return { form, onSubmit, isLoading, setIsLoading };
}