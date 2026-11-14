import { getProductosByTienda } from "@/Connections/productos";
import { getSession } from "@/lib/authentication";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const session = await getSession();
        if(!session) {
            return NextResponse.json({error : true, message : "No autorizado"}, {status : 401});
        }
        const tiendaId = request.nextUrl.searchParams.get("tiendaId");
        const response = await getProductosByTienda(tiendaId);
        return NextResponse.json(response?.data);

    } catch (error) { 
        console.log('[SERVER] Error : ',error)
        return NextResponse.json(
          { error: true, message: "Error al obtener movimientos" },
          { status: 500 },
        );

    }
}