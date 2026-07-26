'use client'
import React from 'react'
import SkeletonRow from './elements/SkeletonRow'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'

const fmt = v =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

const fmtDate = d =>
    d
        ? new Date(d).toLocaleString('es-PE', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
          })
        : '—'

const HEADERS = ['#', 'Cliente', 'Tipo Pago', 'Total', 'Fecha', 'Acciones']

function TipoPagoBadge({ tipo }) {
    const t = (tipo ?? '').toUpperCase()
    if (t === 'CREDITO' || t === 'CRÉDITO')
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                Crédito
            </span>
        )
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            Contado
        </span>
    )
}

export default function TablaVentas({ data = [], loading = false, onVerDetalle }) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {HEADERS.map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[...Array(5)].map((_, i) => <SkeletonRow key={i} cols={6} />)}
                    </tbody>
                </table>
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <ReceiptLongIcon style={{ fontSize: 28, color: '#D1D5DB' }} />
                </div>
                <p className="text-gray-400 text-sm font-medium">Sin ventas registradas</p>
                <p className="text-gray-300 text-xs mt-1">Las ventas de esta tienda aparecerán aquí</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {HEADERS.map(h => (
                                <th
                                    key={h}
                                    className={`px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${
                                        h === 'Acciones' ? 'text-right' : 'text-left'
                                    }`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((v, i) => (
                            <tr key={v.id ?? i} className="hover:bg-gray-50/60 transition-colors group">
                                {/* ID */}
                                <td className="px-4 py-3.5">
                                    <span className="font-mono text-xs bg-[#1F4363]/8 text-[#1F4363] px-2 py-1 rounded-lg font-semibold">
                                        #{v.id}
                                    </span>
                                </td>

                                {/* Cliente */}
                                <td className="px-4 py-3.5">
                                    <p className="font-semibold text-[#1F4363] truncate max-w-[200px]">
                                        {v.cliente?.nombre ?? v.clienteNombre ?? v.nombreCliente ?? (
                                            <span className="text-gray-300 font-normal">Sin cliente</span>
                                        )}
                                    </p>
                                    {(v.cliente?.documento ?? v.documentoCliente) && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {v.cliente?.documento ?? v.documentoCliente}
                                        </p>
                                    )}
                                </td>

                                {/* Tipo pago */}
                                <td className="px-4 py-3.5">
                                    <TipoPagoBadge tipo={v.tipoPago ?? v.tipo_pago} />
                                </td>

                                {/* Total */}
                                <td className="px-4 py-3.5 font-semibold text-[#1F4363]">
                                    {fmt(v.total ?? v.montoTotal ?? v.totalVenta)}
                                </td>

                                {/* Fecha */}
                                <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                                    {fmtDate(v.fecha ?? v.fechaVenta ?? v.createdAt ?? v.created_at)}
                                </td>

                                {/* Acciones */}
                                <td className="px-4 py-3.5 text-right">
                                    <button
                                        onClick={() => onVerDetalle?.(v)}
                                        title="Ver detalle"
                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#1F4363]/10 text-[#1F4363] transition-all"
                                    >
                                        <VisibilityIcon style={{ fontSize: 17 }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}