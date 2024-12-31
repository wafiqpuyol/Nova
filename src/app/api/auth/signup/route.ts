import { NextResponse } from "next/server"
import { prismaClient } from "@/lib/db"
import { SignUpSchema } from "@/schema/signUpSchema"
import bcrypt from "bcrypt"
import { SALT_ROUND } from "@/lib/constant"
import { StatusCodes } from 'http-status-codes';
import { formateErrResponse } from "@/lib/utils"


export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsedPayload = SignUpSchema.safeParse(body)

        if (!parsedPayload.success) {
            return NextResponse.json(
                formateErrResponse({
                    message: parsedPayload.error.errors[0].message,
                    data: {},
                    path: parsedPayload.error.errors[0].path,
                }),
                { status: StatusCodes.UNAUTHORIZED })
        }

        const existedUsername = await prismaClient.user.findUnique({
            where: {
                username: parsedPayload.data.username
            }
        });
        if (existedUsername) {
            return NextResponse.json(
                formateErrResponse({ message: "Username is already taken", data: {} }),
                { status: StatusCodes.CONFLICT }
            );
        }

        const existedUser = await prismaClient.user.findUnique({
            where: {
                email: parsedPayload.data.email,
            }
        });
        if (existedUser) {
            return NextResponse.json(
                formateErrResponse({ message: "Email is already taken", data: {} }),
                { status: StatusCodes.CONFLICT });
        }

        const hashedPassword = await bcrypt.hash(parsedPayload.data.password, SALT_ROUND);
        const newUser = await prismaClient.user.create({
            data: {
                username: parsedPayload.data.username,
                email: parsedPayload.data.email,
                hashedPassword,
            },
        });

        return NextResponse.json(
            formateErrResponse({ message: "Account created successfully", data: newUser }),
            { status: StatusCodes.CREATED });
    } catch (error: unknown) {
        return NextResponse.json({
            message: error || "Something went wrong while signing up",
        }, { status: StatusCodes.INTERNAL_SERVER_ERROR })
    }
}