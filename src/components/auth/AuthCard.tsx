import React from 'react'
import Image from "next/image"
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { SignInCard } from "./SignInCard"
import { SignUpCard } from "./SignUpCard"


interface AuthCardProps {
    signIn?: boolean
}
export const AuthCard: React.FC<AuthCardProps> = ({ signIn }) => {
    return (
        <>
            <Card className="w-full sm:min-w-[28rem] sm:w-auto">
                <CardHeader>
                    <Image
                        alt=""
                        className="rounded-full object-cover self-center"
                        width={50}
                        height={50}
                        src={"https://github.com/shadcn.png"}
                    />
                    <CardTitle className="pt-2">
                        {signIn ? "Sign in" : "Sign up"}
                    </CardTitle>
                    <CardDescription>
                        {signIn ? "Welcome back to ...." : "Create your account"}
                    </CardDescription>
                </CardHeader>
                {signIn ? <SignInCard />: <SignUpCard />}
            </Card>
            <p className="text-sm">
                {signIn
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                <Link
                    className="text-primary"
                    href={signIn ? "/sign-up" : "/sign-in"}
                >
                    {signIn ? "Sign up" : "Sign in"}{" "}
                </Link>
            </p>
        </>
    )
}