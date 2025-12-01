"use server"

import { LOGIN_USER } from "@/conexion/login";
import {SignJWT, jwtVerify} from "jose";
import {cookies} from "next/headers";

const SECRET_KEY = process.env.SECRET_KEY;

const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload) {
    return new SignJWT(payload)
    .setProtectedHeader({alg : "HS256"})
    .setIssuedAt()
    .setExpirationTime('1 day')
    .sign(key);
}

export async function decrypt(input) {
    const {payload} = await jwtVerify(input, key, {
        algorithms : ["HS256"]
    });
    return payload;
}

export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    if(!session) return null;
    return await decrypt(session);
}

export async function login(dataUser) {
    const response = await LOGIN_USER(dataUser);
    if (!response.ok) {
        const msg = await response.json();
        return {
            error : true,
            message : msg?.message
        }
    }
    const jsonResponse = await response.json();
    const date = new Date();
    const expires = date.setHours(date.getHours()+24);
    const user = {username : dataUser?.username ,access_token : jsonResponse?.access_token};
    const session = await encrypt(user);
    (await cookies()).set("session", session, {expires, httpOnly : true});
    return {
        error : false,
        message : "Ingreso exitoso"
    }   
}

// Funcion de cerrar sesión
export async function logout() {
    
}