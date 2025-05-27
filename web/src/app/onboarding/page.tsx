import React from 'react'
import {getAuthSession} from "@/lib/auth"
const page = async () => {
    const a = await getAuthSession()
    console.log(a)
    return (
        <div>oNBOARDING</div>
    )
}

export default page 