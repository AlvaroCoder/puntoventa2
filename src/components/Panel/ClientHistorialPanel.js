import { X } from 'lucide-react';
import React, { useState } from 'react'

const MOCK_COMPRAS = [
    { id: 1, fecha: '2026-04-10', producto: 'Laptop HP 15"',     monto: 2800, estado: 'Pagado'    },
    { id: 2, fecha: '2026-03-22', producto: 'Monitor LG 24"',    monto: 950,  estado: 'Pagado'    },
    { id: 3, fecha: '2026-02-15', producto: 'Teclado Mecánico',  monto: 320,  estado: 'Pagado'    },
    { id: 4, fecha: '2026-01-05', producto: 'Mouse Inalámbrico', monto: 120,  estado: 'Pagado'    },
]

const MOCK_CREDITOS = [
    { id: 1, fecha: '2026-04-10', monto: 2800, cuotas: 12, saldo: 1400,  estado: 'Vigente'   },
    { id: 2, fecha: '2026-03-22', monto: 950,  cuotas: 6,  saldo: 0,     estado: 'Cancelado' },
    { id: 3, fecha: '2025-11-01', monto: 500,  cuotas: 3,  saldo: 0,     estado: 'Cancelado' },
]

export default function ClientHistorialPanel({
    client, onClose
}) {
    const [activeTab, setActiveTab] = useState('compras');
    const nombre = client?.nombre_completo
        ?? `${client?.nombre_completo ?? ''} ${client?.apellido_cliente ?? ''}`
        ?? 'Cliente';
    
    const inicial = nombre[0]?.toUpperCase() ?? 'C';
    const totalDeuda = MOCK_CREDITOS.reduce((acc, c) => acc + (c.saldo ?? 0), 0)
    const totalCompras = MOCK_COMPRAS.reduce((acc, c) => acc + c.monto, 0)
  return (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header del cliente */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 bg-[#1F4363]/3">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1F4363] flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {inicial}
                    </div>
                    <div>
                        <h2 className="font-bold text-[#1F4363] text-base">{nombre}</h2>
                        <p className="text-sm text-gray-400">{client?.email ?? '—'} · {client?.telefono_cliente ?? client?.telefono ?? '—'}</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                    <X size={16} />
                </button>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                <div className="px-6 py-4">
                    <p className="text-xs text-gray-400 mb-0.5">Total compras</p>
                    <p className="font-bold text-[#1F4363]">S/ {totalCompras.toLocaleString()}</p>
                </div>
                <div className="px-6 py-4">
                    <p className="text-xs text-gray-400 mb-0.5">Saldo pendiente</p>
                    <p className={`font-bold ${totalDeuda > 0 ? 'text-red-500' : 'text-green-600'}`}>
                        S/ {totalDeuda.toLocaleString()}
                    </p>
                </div>
                <div className="px-6 py-4">
                    <p className="text-xs text-gray-400 mb-0.5">Categoría</p>
                    <p className="font-bold text-[#1F4363]">{client?.categoria ?? '—'}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                {[
                    { key: 'compras',  label: 'Historial de Compras',   icon: ShoppingCart },
                    { key: 'creditos', label: 'Historial Crediticio',    icon: CreditCard   },
                ].map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.key
                                    ? 'border-[#FF821E] text-[#FF821E]'
                                    : 'border-transparent text-gray-400 hover:text-[#1F4363]'
                            }`}
                        >
                            <Icon size={15} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Contenido del tab */}
            <div className="px-6 py-4">
                {activeTab === 'compras' && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                                <th className="pb-3 font-medium">Fecha</th>
                                <th className="pb-3 font-medium">Producto</th>
                                <th className="pb-3 font-medium text-right">Monto</th>
                                <th className="pb-3 font-medium text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_COMPRAS.map(c => (
                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 text-gray-500">{c.fecha}</td>
                                    <td className="py-3 font-medium text-[#1F4363]">{c.producto}</td>
                                    <td className="py-3 text-right font-semibold text-[#1F4363]">S/ {c.monto.toLocaleString()}</td>
                                    <td className="py-3 text-center">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADO_BADGE[c.estado] ?? ''}`}>
                                            {c.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'creditos' && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                                <th className="pb-3 font-medium">Fecha</th>
                                <th className="pb-3 font-medium text-right">Monto</th>
                                <th className="pb-3 font-medium text-center">Cuotas</th>
                                <th className="pb-3 font-medium text-right">Saldo</th>
                                <th className="pb-3 font-medium text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_CREDITOS.map(c => (
                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 text-gray-500">{c.fecha}</td>
                                    <td className="py-3 text-right font-semibold text-[#1F4363]">S/ {c.monto.toLocaleString()}</td>
                                    <td className="py-3 text-center text-gray-500">{c.cuotas}</td>
                                    <td className={`py-3 text-right font-bold ${c.saldo > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                        S/ {c.saldo.toLocaleString()}
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADO_BADGE[c.estado] ?? ''}`}>
                                            {c.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
  )
};