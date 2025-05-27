"use client"

import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { CardContent } from '../ui/card'
import { Form, FormField, FormItem, FormControl, FormMessage } from '../ui/form'
import { LoadingState } from '../ui/loadingState'
import { useSignIn } from '@/hooks/auth/useSignIn'
import { ProviderSignInBtnWrapper } from "./ProviderSignInBtnWrapper"

export const SignInCard = () => {
    const { form, isLoading, onSubmit, setIsLoading } = useSignIn()
    return (
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                    <ProviderSignInBtnWrapper signInCard onLoading={setIsLoading} />
                    <div className="space-y-1.5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Please enter a valid email" {...field} />
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
                            className="w-full font-bold"
                            type="submit"
                        >
                            {isLoading ? (
                                <LoadingState loadingText={"Please wait"} />
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    )
}