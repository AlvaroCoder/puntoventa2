import React from 'react'
import SkeletonRow from './elements/SkeletonRow'
import SwapVertIcon from '@mui/icons-material/SwapVert'

const fmt = v =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0);

const arrayToDate = (arr) => {
    if (!Array.isArray(arr) || arr.length < 3) return null;

    const [
        year,
        month,
        day,
        hour = 0,
        minute = 0,
        second = 0
    ] = arr;

    return new Date(year, month - 1, day, hour, minute, second);
};

const fmtDate = (d) =>
    d
        ? d.toLocaleString("es-PE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "—";


export default function TablaMovimientos({
    loading = false,
    data = [],
}) {
    const headers = ['Tipo', 'Monto', 'Descripción', 'Fecha']

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {headers.map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[...Array(4)].map((_, i) => <SkeletonRow key={i} cols={4} />)}
                    </tbody>
                </table>
            </div>
        )
    }
    if (!data.length) {
                return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <SwapVertIcon style={{ fontSize: 28, color: '#D1D5DB' }} />
                </div>
                <p className="text-gray-400 text-sm font-medium">Sin movimientos registrados</p>
                <p className="text-gray-300 text-xs mt-1">Agrega un movimiento con el botón de arriba</p>
            </div>
        )
    }
        return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {headers.map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((m, i) => (
                            <tr key={m.id ?? i} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 py-3.5">
                                    {m.tipoMovimiento === 'INGRESO' ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            ↑ Entrada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                                            ↓ Salida
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-[#1F4363]">
                                    {fmt(m.monto)}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600 max-w-[260px] truncate">
                                    {m.concepto ?? <span className="text-gray-300">—</span>}
                                </td>
                                <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                                    {fmtDate(arrayToDate(m?.fechaHora))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};
