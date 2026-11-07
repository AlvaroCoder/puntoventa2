import { NextResponse } from 'next/server';
import { uploadImage } from '@/Connections/images';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const response = await uploadImage(formData);
        return NextResponse.json(response?.data ?? response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
    }
}