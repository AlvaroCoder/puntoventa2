'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Package, X } from 'lucide-react'

export default function ProductCard({ item, idx, onRemove }) {
  return (
      <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm"
      >
                   <div className="flex gap-3 p-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imagenPreview
                        ? <Image src={item.imagenPreview} className="w-full h-full object-cover" width={56} height={56} alt={item.form.nombre} />
                        : <Package size={18} className="text-gray-300" />
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1F4363] text-sm truncate">
                        {item.form.nombre || 'Sin nombre'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                        {item.form.tipoPreset?.nombre ?? item.form.tipoProducto}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-bold text-[#FF821E]">S/ {item.form.precioVenta}</span>
                        <span className="text-[10px] text-gray-200">·</span>
                        <span className="text-[10px] text-gray-400">
                            {item.variantes.filter(v => v.talla || v.color).length || 1} var.
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                        onClick={onRemove}
                        className="text-red-300 hover:text-red-500 transition-colors"
                    >
                        <X size={13} />
                    </button>
                    <span className="text-[10px] font-bold text-gray-200">#{idx + 1}</span>
                </div>
            </div>   
    </motion.div>
  )
};
