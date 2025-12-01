'use client'
import { getSession } from "@/lib/authentication";

export async function CREATE_CLIENT(data={}) {
    const URL_CREATE_CLIENT = process.env.NEXT_PUBLIC_URL_GET_CLIENTS;
    const session=await getSession();
    console.log(session);
    
    return await fetch(URL_CREATE_CLIENT,{
        method : 'POST',
        headers : {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${session?.access_token}`
        },
        body : JSON.stringify(data),
        mode : 'cors'
    })
}