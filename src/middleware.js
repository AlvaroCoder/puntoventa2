import { NextRequest, NextResponse   } from "next/server";
import { getSession } from "./lib/authentication";

// Rutas protegidas por nivel mínimo de permiso
const RUTAS_PROTEGIDAS = [
    { patron: '/dashboard/trabajadores', minNivel: 4 },
    { patron: '/dashboard/tiendas',      minNivel: 4 },
    { patron: '/dashboard/inventario',   minNivel: 3 },
    { patron: '/dashboard/caja',         minNivel: 2 },
];

export default async function middleware(request = NextRequest) {
    const session = await getSession();
    const pathname = request.nextUrl.pathname;

    if (session !== null && pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!session && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

/**
 * 
 *     // Control de acceso por nivel dentro del dashboard
    if (session && pathname.startsWith('/dashboard')) {
        const nivelPermiso = session.nivel_permiso ?? 0;
        const ruta = RUTAS_PROTEGIDAS.find(r => pathname.startsWith(r.patron));
        if (ruta && nivelPermiso < ruta.minNivel) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
 */

    return NextResponse.next();
}
export const config = {
    matcher: ['/login', '/dashboard/:path*'],
};