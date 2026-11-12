import { getMovimientosByCaja } from "@/Connections/caja";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/authentication";
export async function GET(request) { 
    try {
        const session = await getSession();
        if(!session) {
            return NextResponse.json({error : true, message : "No autorizado"}, {status : 401});
        }
        const cajaId = request.nextUrl.searchParams.get("cajaId");
        const response = await getMovimientosByCaja(cajaId);
        return NextResponse.json(response?.data);
    } catch (error) { 
        return NextResponse.json({error : true, message : "Error al obtener movimientos"}, {status : 500});
    }
}