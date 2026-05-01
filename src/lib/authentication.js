"use server"

import { LOGIN_USER, LOGIN_GOOGLE } from "@/conexion/login";
import {SignJWT, jwtVerify} from "jose";
import {cookies} from "next/headers";
import { redirect } from "next/navigation";

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
    const data = jsonResponse?.data ?? {};
    const esDueno = data?.tipo === 'dueno';
    const user = {
        email: dataUser?.email,
        nombre_completo: data?.usuario?.nombre_completo,
        access_token: data?.token,
        esAdmin: esDueno,
        empresa_id: data?.empresa_id ?? null,
        tienda_id: data?.tienda_id ?? null,
        rol_id: data?.rol_id ?? null,
        nivel_permiso: esDueno ? 999 : (data?.nivel_permiso ?? 0),
    };
    const session = await encrypt(user);
    (await cookies()).set("session", session, {expires, httpOnly : true});
    return {
        error : false,
        message : "Ingreso exitoso"
    }
}

export async function loginWithGoogle(credential) {
    const response = await LOGIN_GOOGLE(credential);
    if (!response.ok) {
        const msg = await response.json();
        return { error: true, message: msg?.message };
    }
    const jsonResponse = await response.json();
    const date = new Date();
    const expires = date.setHours(date.getHours() + 24);
    const data = jsonResponse?.data ?? {};
    const esDueno = data?.tipo === 'dueno';
    const user = {
        email: data?.usuario?.email,
        nombre_completo: data?.usuario?.nombre_completo,
        access_token: data?.token,
        esAdmin: esDueno,
        empresa_id: data?.empresa_id ?? null,
        tienda_id: data?.tienda_id ?? null,
        rol_id: data?.rol_id ?? null,
        nivel_permiso: esDueno ? 999 : (data?.nivel_permiso ?? 0),
    };
    const session = await encrypt(user);
    (await cookies()).set("session", session, { expires, httpOnly: true });
    return {
        error: false,
        isNewUser: data?.isNewUser ?? false,
        message: "Ingreso exitoso"
    };
}

// Funcion de cerrar sesión
export async function logout() {
    (await cookies()).delete("session");
    redirect("/login");
}