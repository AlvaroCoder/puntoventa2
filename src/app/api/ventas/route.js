import { NextResponse } from "next/server";
import { getSession } from "@/lib/authentication";
import { getVentas } from "@/Connections/ventas";
export default async function GET() {
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