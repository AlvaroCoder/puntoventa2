"use server";
import { cookies } from "next/headers";
import { encrypt } from "./authentication";

export async function encryptData(data) {
    const session = await encrypt(data);
    (await cookies()).set("session-puntoventa360", session, { httpOnly: true });
    return session;
}