import { Package, StoreIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

export default function PreviewCard({
    form, variantes, imagenPreview
}) {
    const tags = variantes?.filter(v => v.talla || v.color);
    return (
        <div className="rounded-2xl border border-[#1F4363]/10 bg-white overflow-hidden shadow-sm">
            <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center overflow-hidden">
                {imagenPreview
                    ? <Image src={imagenPreview} className="w-full h-full object-cover" width={160} height={160} alt="preview" />
                    : <Package size={40} className="text-gray-200" />
                }
                {form.tipoPreset && (
                    <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-1 rounded-full bg-[#1F4363] text-white text-[10px] font-bold shadow-sm">
                            {form.tipoPreset.nombre}
                        </span>
                    </div>
                )}
                {form.precioVenta && (
                    <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 rounded-full bg-[#FF821E] text-white text-xs font-bold shadow-sm">
                            S/ {form.precioVenta}
                        </span>
                    </div>
                )}
            </div>
            <div className="p-4 space-y-2">
                <div>
                    <p className="font-bold text-[#1F4363] text-sm truncate">
                        {form.nombre
                            ? form.nombre
                            : <span className="text-gray-300 font-normal italic text-xs">Nombre del producto...</span>
                        }
                    </p>
                    {form.codigo && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{form.codigo}</p>
                    )}
                </div>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {tags.map((v, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-[#1F4363]/6 text-[10px] font-semibold text-[#1F4363]">
                                {[v.talla, v.color].filter(Boolean).join(' / ')}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[10px] text-gray-400">
                    <span>{tags.length || 1} variante(s)</span>
                    {form.tiendaId && (
                        <span className="font-semibold text-[#198E7B]">
                            <StoreIcon style={{ fontSize: 11, marginRight: 2 }} />
                            Tienda ok
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
};