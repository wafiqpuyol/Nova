import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import bcrypt from 'bcrypt';

export const comparePassword = async (hashedPass: string, rawPass: string): Promise<{ errMsg: string, isPasswordMatched: boolean }> => {
    const isPasswordMatched = await bcrypt.compare(hashedPass, rawPass)
    let errMsg = ""
    if (!isPasswordMatched) {
        errMsg = "Invalid email or password"
    }
    return { errMsg, isPasswordMatched }
}
