import bcrypt from 'bcrypt';

export const comparePassword = async (hashedPass: string, rawPass: string): Promise<{ errMsg: string, isPasswordMatched: boolean }> => {
    const isPasswordMatched = await bcrypt.compare(rawPass, hashedPass)
    let errMsg = ""
    if (!isPasswordMatched) {
        errMsg = "Invalid email or password"
    }
    return { errMsg, isPasswordMatched }
}