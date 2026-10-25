import { NextResponse } from "next/server";
import { getSession } from "@/lib/authentication";
import { getAlmacenesByUser } from "@/Connections/almacen";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
              { error: true, message: "No autorizado" },
              { status: 401 },
            );
        };

        const data = await getAlmacenesByUser();
        return NextResponse.json(data);
        
    } catch (err) {
        return NextResponse.json(
          { error: true, message: err.message },
          { status: 500 },
        );
    }
}