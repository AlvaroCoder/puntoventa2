import { Check, Warehouse } from 'lucide-react'
import React from 'react'

export default function AlmacenCard({ almacen, selected, onSelect }) {
    return (
        <button
            onClick={onSelect}
            className="text-left w-full bg-white rounded-xl p-5 flex flex-col gap-4 transition-all"
            style={{
                border:    selected ? '2px solid #3960A9' : '0.5px solid rgba(31,47,87,0.12)',
                boxShadow: selected ? '0 0 0 4px rgba(57,96,169,0.08)' : 'none',
                outline:   'none',
            }}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                         style={{ background: 'rgba(57,96,169,0.08)' }}>
                        <Warehouse size={20} color="#3960A9" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-tight" style={{ color: '#1F2F57' }}>
                            {almacen.nombre}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
                            {almacen.codigo}
                        </p>
                    </div>
                </div>
                <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all"
                    style={{
                        border:     `2px solid ${selected ? '#3960A9' : 'rgba(31,47,87,0.2)'}`,
                        background: selected ? '#3960A9' : 'transparent',
                    }}
                >
                    {selected && <Check size={11} color="white" />}
                </div>
            </div>
            
        </button>
    )
}
