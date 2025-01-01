"use client";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface ProviderSignInBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    providerName: "google" | "github";
    onLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProviderSignInBtn: React.FC<ProviderSignInBtnProps> = ({
    children,
    providerName,
    onLoading,
    ...props
}) => {
    const { toast } = useToast()
    // TODO add useProviderLoginError

    const signInHandler = async () => {
        onLoading(true);
        try {
            const signInInfo = await signIn(providerName, { callbackUrl: "/onboarding" });
            if (signInInfo?.error) {
                throw new Error(signInInfo.error)
            }
        } catch (err: unknown) {
            toast({
                title: `${providerName}: Error`,
                description: err.message,
                variant: "destructive",
            })
        }
        onLoading(false);
    };

    return (
        <Button
            onClick={signInHandler}
            {...props}
            variant={"secondary"}
            type="button"
        >
            {children}
        </Button>
    );
};
