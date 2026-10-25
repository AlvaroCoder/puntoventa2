import { createCategoriasProducto, getCategorias } from "@/Connections/productos";
import { getSession } from "@/lib/authentication";
import { NextResponse } from "next/server";

export async function GET() { 
    try { 
        const session = await getSession();
        if(!session) {
            return NextResponse.json({error : true, message : "No autorizado"}, {status : 401});
        }
        const empresaId = session.empresa_id;
        const response = await getCategorias(empresaId);
        return NextResponse.json(response?.data);
    } catch (error) {
        return NextResponse.json({error : true, message : error.message}, {status : 500});
    }
};

export async function POST(request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: true, message: "No autorizado" }, { status: 401 });
        }
        const body = await request.json();
        const response = await createCategoriasProducto(body);
        if (!response.ok) {
            throw new Error("No se pudo crear la categoria");
        }

        return NextResponse.json(response?.data)
    } catch (error) {
        return NextResponse.json({error : true, message : error.message}, {status : 500});
    }
}
