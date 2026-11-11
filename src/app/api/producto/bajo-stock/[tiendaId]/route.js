import { getProductosBajoStock } from "@/Connections/productos";
import { getSession } from "@/lib/authentication";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: true, message: "No autorizado" },
        { status: 401 },
      );
    }
    const { tiendaId } = await params;
    const response = await getProductosBajoStock(tiendaId);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 },
    );
  }
}
