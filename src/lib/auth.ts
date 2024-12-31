import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { SignInSchema } from '../schema/signInSchema';
import { prismaClient } from "./db";
import { comparePassword } from "@/lib/common";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        error: "/sign-in",
        signIn: "/sign-in",
    },
    adapter: PrismaAdapter(prismaClient) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Enter Username" },
                email: { label: "Email", type: "text", placeholder: "Enter Email" },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter Password",
                },
            },
            async authorize(credentials) {
                const validatedFields = SignInSchema.safeParse(credentials)
                if (!validatedFields.success) {
                    throw new Error("Invalid email or password")
                }

                const { email, password } = validatedFields.data
                const isUserExist = await prismaClient.user.findUnique({
                    where: {
                        email
                    }
                })
                if (!isUserExist?.email || !isUserExist.hashedPassword) {
                    throw new Error("Invalid email or password. Please sign up first")
                }

                const { errMsg, isPasswordMatched } = await comparePassword(isUserExist.hashedPassword, password)
                if (!isPasswordMatched) {
                    throw new Error(errMsg)
                }

                return isUserExist
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.username = token.username;
                session.user.surname = token.surname;
                session.user.completedOnboarding = !!token.completedOnboarding;
            }

            const isUserExist = await prismaClient.user.findUnique({
                where: {
                    id: token.id,
                },
            });

            if (isUserExist) {
                session.user.image = isUserExist.image;
                session.user.completedOnboarding = isUserExist.completedOnboarding;
                session.user.username = isUserExist.username;
            }

            return session;
        },
        async jwt({ token, user }) {
            const isUserExist = await prismaClient.user.findFirst({
                where: {
                    email: token.email,
                },
            });

            if (!isUserExist) {
                token.id = user!.id;
                return token;
            }

            return {
                id: isUserExist.id,
                username: isUserExist.username,
                email: isUserExist.email,
                picture: isUserExist.image,
            };
        }
    },
}


export const getAuthSession = () => getServerSession(authOptions);