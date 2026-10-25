import { NextResponse } from "next/server";
import { createProducto, getProductosByEmpresa } from "@/Connections/productos";
import { getSession } from "@/lib/authentication";
export async function GET() {
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
        const body = await request?.json()
        const response = await createProducto(body);
        if (!response.ok) {
            throw new Error("No se pudo crear el producto");
        }
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
          { error: true, message: error.message },
          { status: 500 },
        );
    }
}