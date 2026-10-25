import { getTiendasByEmpresa, deleteTienda } from "@/Connections/tiendas";
import { getSession } from "@/lib/authentication";
import { NextResponse } from "next/server";

export async function GET() { 
    try { 
        const session = await getSession();
        if(!session) {
            return NextResponse.json({error : true, message : "No autorizado"}, {status : 401});
        }
        const empresaId = session.empresa_id;
        const response = await getTiendasByEmpresa(empresaId);
        console.log("Response from getTiendasByEmpresa:", response);
        return NextResponse.json(response?.data);
    } catch (error) {
        return NextResponse.json({error : true, message : error.message}, {status : 500});
    }
};


export async function DELETE(request, { params }) {
    try {
        const session = await getSession();
        if (!session)
          return NextResponse.json(
            { error: true, message: "No autorizado" },
            { status: 401 },
          );
        const { id } = params;
        const result = await deleteTienda(id);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({error : true, message : error.message}, {status : 500});
    }
}