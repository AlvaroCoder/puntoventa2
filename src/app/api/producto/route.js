import { NextResponse } from "next/server";
import { createProducto, getProductosByEmpresa } from "@/Connections/productos";
import { getSession } from "@/lib/authentication";
export async function GET(request) {
    try {
        const session = await getSession();
        if(!session) {
            return NextResponse.json({error : true, message : "No autorizado"}, {status : 401});
        }
        const empresaId = session.empresa_id;
        const data = await getProductosByEmpresa(empresaId);

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({error : true, message : error.message}, {status : 500});
    }
};

export async function POST(request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
              { error: true, message: "No autorizado" },
              { status: 401 },
            );
        };
        const body = await request?.json();
        console.log("Body recibido en POST /api/producto:", body);
        const response = await createProducto(body);
        console.log("Respuesta de createProducto:", response);
        if (!response.ok) {
            throw new Error("No se pudo crear el producto");
        }
        return NextResponse.json(response);
    } catch (error) {
        console.log("Error en POST /api/producto:", error);
        return NextResponse.json(
          { error: true, message: error.message },
          { status: 500 },
        );
    }
}