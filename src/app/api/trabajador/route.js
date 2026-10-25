import { getTrabajadorByIdUser } from '@/Connections/trabajadores';
import { getSession } from '@/lib/authentication';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
              { error: true, message: "No autorizado" },
              { status: 401 },
            );
        }
        const idUser = session?.id;
        const data = await getTrabajadorByIdUser(idUser);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
          { error: true, message: error.message },
          { status: 500 },
        );

    }
}