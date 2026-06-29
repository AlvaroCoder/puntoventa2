'use client'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import StoreIcon from '@mui/icons-material/Store'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'

function SkeletonRow() {
    return (
        <tr className="border-b border-gray-50">
            {[40, 55, 30, 45, 40, 35, 28, 20].map((w, i) => (
                <td key={i} className="px-4 py-3.5">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${w}%` }} />
                </td>
            ))}
        </tr>
    )
}

function EstadoBadge({ activa }) {
    return activa
        ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Activa</span>
        : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Inactiva</span>
}

export default function TableTiendas({ data = [], loading = false, onEdit, onDelete, onToggleEstado }) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {['', 'Nombre', 'Código', 'Responsable', 'Teléfono', 'Dirección', 'Estado', 'Acciones'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                </table>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <StoreIcon style={{ fontSize: 32, color: '#D1D5DB' }} />
                </div>
                <p className="text-gray-400 text-sm font-medium">No tienes tiendas registradas</p>
                <p className="text-gray-300 text-xs mt-1">Crea tu primera tienda con el botón de arriba</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="px-4 py-3 w-10" />
                            {['Nombre', 'Código', 'Responsable', 'Teléfono', 'Dirección', 'Estado', 'Acciones'].map(h => (
                                <th key={h} className={`px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${h === 'Acciones' ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map(tienda => (
                            <tr key={tienda.id} className="hover:bg-gray-50/60 transition-colors group">
                                {/* Avatar */}
                                <td className="px-4 py-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-[#1F4363]/10 flex items-center justify-center text-[#1F4363] font-bold text-sm shrink-0">
                                        {(tienda.nombre ?? 'T')[0].toUpperCase()}
                                    </div>
                                </td>

                                {/* Nombre */}
                                <td className="px-4 py-3.5">
                                    <p className="font-semibold text-[#1F4363] truncate max-w-[180px]">{tienda.nombre}</p>
                                    {tienda.fecha_apertura && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Apertura: {new Date(tienda.fecha_apertura).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    )}
                                </td>

                                {/* Código */}
                                <td className="px-4 py-3.5">
                                    <span className="font-mono text-xs bg-[#1F4363]/8 text-[#1F4363] px-2 py-1 rounded-lg font-semibold">
                                        {tienda.codigo}
                                    </span>
                                </td>

                                {/* Responsable */}
                                <td className="px-4 py-3.5 text-sm text-gray-600 truncate max-w-[160px]">
                                    {tienda.responsable ?? <span className="text-gray-300">—</span>}
                                </td>

                                {/* Teléfono */}
                                <td className="px-4 py-3.5 text-sm text-gray-600">
                                    {tienda.telefono ?? <span className="text-gray-300">—</span>}
                                </td>

                                {/* Dirección */}
                                <td className="px-4 py-3.5 text-sm text-gray-500 truncate max-w-[200px]">
                                    {tienda.direccion ?? <span className="text-gray-300">—</span>}
                                </td>

                                {/* Estado */}
                                <td className="px-4 py-3.5">
                                    <EstadoBadge activa={tienda.activa} />
                                </td>

                                {/* Acciones */}
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => onToggleEstado?.(tienda)}
                                            title={tienda.activa ? 'Desactivar' : 'Activar'}
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                                                tienda.activa
                                                    ? 'hover:bg-amber-50 text-amber-500'
                                                    : 'hover:bg-green-50 text-green-500'
                                            }`}
                                        >
                                            <PowerSettingsNewIcon style={{ fontSize: 17 }} />
                                        </button>
                                        <button
                                            onClick={() => onEdit?.(tienda)}
                                            title="Editar"
                                            className="w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#1F4363]/10 text-[#1F4363] transition-all"
                                        >
                                            <EditIcon style={{ fontSize: 17 }} />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(tienda.id)}
                                            title="Eliminar"
                                            className="w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 transition-all"
                                        >
                                            <DeleteIcon style={{ fontSize: 17 }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}