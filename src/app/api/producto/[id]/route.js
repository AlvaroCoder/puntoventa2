import { NextResponse } from "next/server";
import {
  getProductoById,
  getProductoByIdAndTiendaId,
} from "@/Connections/productos";
import { getSession } from "@/lib/authentication";

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: true, message: "No autorizado" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const tiendaId = request.nextUrl.searchParams.get("tiendaId");

    const producto = tiendaId
      ? await getProductoByIdAndTiendaId(id, tiendaId)
      : await getProductoById(id);

    if (!producto?.data || producto.data.empresaId !== session.empresa_id) {
      return NextResponse.json(
        { error: true, message: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(producto);
  } catch (error) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 },
    );
  }
}
