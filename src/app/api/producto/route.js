import { NextResponse } from "next/server";
import { getProductosByEmpresa } from "@/Connections/productos";
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
}
