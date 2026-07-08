import React from 'react'
import SkeletonRow from './elements/SkeletonRow'
import HistoryIcon from '@mui/icons-material/History'

const fmt = v =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0);

const fmtDate = d => d
        ? new Date(d).toLocaleString('es-PE', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
        : '—';

export default function TablaSesiones({
    data = [],
    loading = false,
}) {
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
                        {[...Array(3)].map((_, i) => <SkeletonRow key={i} cols={5} />)}
                    </tbody>
                </table>
            </div>
        )
    }
    if (!data.length) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <HistoryIcon style={{ fontSize: 28, color: '#D1D5DB' }} />
                </div>
                <p className="text-gray-400 text-sm font-medium">Sin sesiones registradas</p>
                <p className="text-gray-300 text-xs mt-1">Las sesiones aparecerán al abrir y cerrar la caja</p>
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
                        {data.map((s, i) => (
                            <tr key={s.id ?? i} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 py-3.5">
                                    {s.fecha_cierre ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                                            Cerrada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            Abierta
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                                    {fmtDate(s.fecha_apertura)}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                                    {fmtDate(s.fecha_cierre)}
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-[#1F4363]">
                                    {fmt(s.monto_apertura)}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600">
                                    {s.monto_cierre != null
                                        ? fmt(s.monto_cierre)
                                        : <span className="text-gray-300">—</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};
