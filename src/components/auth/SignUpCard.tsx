"use client"

import React from 'react'
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CardContent } from '../ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useSignUp } from "@/hooks/auth/useSignUp"
import { LoadingState } from "../ui/loadingState"

export const SignUpCard = () => {
    const { form, onSubmit, isLoading } = useSignUp()

    return (
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                    {/* //TODO add provider sign in btns */}
                    <div className="space-y-1.5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder={"Please enter a valid email"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder={"Username"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Button
                            disabled={isLoading}
                            className="w-full font-bold text-white"
                            type="submit"
                        >
                            {isLoading ? (
                                <LoadingState loadingText="Please wait" />
                            ) : (
                                "Sign up"
                            )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            By signing up you agree to our {" "}
                            <span className="font-bold">Terms of Service</span>
                        </p>
                    </div>
                </form>
            </Form>
        </CardContent>
    )
}