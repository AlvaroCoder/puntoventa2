'use client'

import React from 'react'
import Link from 'next/link'
import { Database, Package, Layers, Truck, ArrowRight } from 'lucide-react'

const OPCIONES = [
    {
        id:          'base-datos',
        Icon:        Database,
        iconBg:      'rgba(57,96,169,0.10)',
        iconColor:   '#3960A9',
        titulo:      'Base de datos',
        descripcion: 'Importa una base de datos existente con tus productos (Excel, CSV, etc.).',
        href:        '/dashboard/inventario/productos/crear/importar',
    },
    {
        id:          'semilla',
        Icon:        Package,
        iconBg:      'rgba(30,179,178,0.10)',
        iconColor:   '#1EB3B2',
        titulo:      'Productos Semilla',
        descripcion: 'Productos pre configurados para el negocio.',
        href:        '/dashboard/inventario/productos/crear/semilla',
    },
    {
        id:          'lote',
        Icon:        Layers,
        iconBg:      'rgba(100,80,190,0.10)',
        iconColor:   '#6450BE',
        titulo:      'Lote de productos',
        descripcion: 'Registra un lote de productos nuevos de forma manual.',
        href:        '/dashboard/inventario/productos/crear/lote',
    },
    {
        id:          'transito',
        Icon:        Truck,
        iconBg:      'rgba(232,160,32,0.12)',
        iconColor:   '#E8A020',
        titulo:      'En tránsito',
        descripcion: 'Ingresa productos de una entrada de mercancía.',
        href:        '/dashboard/logistica/ordenes-compra/crear',
    },
]

export default function CrearProductoPage() {
    return (
        <div className="min-h-full bg-[#E1E7F0] px-8 py-10 flex flex-col">

            <h1 className="text-2xl font-bold" style={{ color: '#1F2F57' }}>
                ¿Cómo deseas ingresar tus productos?
            </h1>
            <p className="text-sm mt-1.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
                Selecciona la opción que mejor se adapte a tus necesidades.
            </p>

            {/* Grid de opciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {OPCIONES.map(({ id, Icon, iconBg, iconColor, titulo, descripcion, href }) => (
                    <Link key={id} href={href} className="group">
                        <div
                            className="bg-white rounded-2xl p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-200"
                            style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
                        >
                            {/* Ícono */}
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                                style={{ backgroundColor: iconBg }}
                            >
                                <Icon size={30} style={{ color: iconColor }} />
                            </div>

                            {/* Texto */}
                            <h3 className="text-base font-bold mb-2" style={{ color: '#1F2F57' }}>
                                {titulo}
                            </h3>
                            <p className="text-sm flex-1 leading-relaxed" style={{ color: 'rgba(31,47,87,0.58)' }}>
                                {descripcion}
                            </p>

                            <div className="mt-6 flex justify-end">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5"
                                    style={{ backgroundColor: iconBg }}
                                >
                                    <ArrowRight size={16} style={{ color: iconColor }} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    )
}
