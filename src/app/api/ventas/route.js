import { NextResponse } from "next/server";
import { getSession } from "@/lib/authentication";
import { createVenta, getVentas } from "@/Connections/ventas";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: true, message: "No autorizado" }, { status: 401 });
        }
        const response = await getVentas();
        return NextResponse.json(response?.data);
    } catch (error) {
        return NextResponse.json({ error: true, message: "Error al obtener las ventas" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: true, message: "No autorizado" }, { status: 401 });
        }
        const body = await request.json();
        const response = await createVenta(body);
        return NextResponse.json(response?.data ?? response);
    } catch (error) {
        return NextResponse.json(
            { error: true, message: error.message },
            { status: 500 }
        );
    }
}
