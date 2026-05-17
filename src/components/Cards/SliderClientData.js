'use client'
import React from 'react'
import { X, Pencil, Mail, Phone, MapPin, CreditCard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CATEGORIA_BADGE = {
    RESPONSABLE: 'bg-green-100 text-green-700',
    REGULAR:     'bg-blue-100 text-blue-700',
    VIP:         'bg-[#FF821E]/15 text-[#FF821E]',
    MOROSO:      'bg-red-100 text-red-600',
    DEUDOR:      'bg-red-100 text-red-600',
}

const TIPO_DOC_BADGE = {
    DNI:       'bg-[#1F4363]/10 text-[#1F4363]',
    RUC:       'bg-purple-100 text-purple-700',
    'C.E.':    'bg-yellow-100 text-yellow-700',
    PASAPORTE: 'bg-gray-100 text-gray-500',
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={15} className="text-gray-400" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-[#1F4363] truncate">
                    {value ?? <span className="text-gray-300 font-normal">Sin información</span>}
                </p>
            </div>
        </div>
    )
}

export default function SliderClientData({ open, onClose, clientData, onEdit }) {
    if (!clientData) return null

    const nombre  = clientData.nombre_completo ?? '—'
    const inicial = nombre[0]?.toUpperCase() ?? '?'
    const categoriaClass = CATEGORIA_BADGE[clientData.categoria] ?? 'bg-gray-100 text-gray-500'
    const tipoDocClass   = TIPO_DOC_BADGE[clientData.tipo_documento] ?? 'bg-gray-100 text-gray-500'

    const handleEdit = () => {
        onClose()
        onEdit(clientData)
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="font-bold text-[#1F4363] text-lg">Detalle del cliente</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto">

                    {/* Perfil del cliente */}
                    <div className="px-6 py-6 flex flex-col items-center text-center border-b border-gray-100">
                        <div className="w-16 h-16 rounded-full bg-[#1F4363] flex items-center justify-center text-white font-bold text-2xl mb-3">
                            {inicial}
                        </div>
                        <h3 className="font-bold text-[#1F4363] text-lg leading-tight">{nombre}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tipoDocClass}`}>
                                {clientData.tipo_documento}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">{clientData.numero_documento}</span>
                        </div>
                        {clientData.categoria && (
                            <span className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${categoriaClass}`}>
                                {clientData.categoria}
                            </span>
                        )}
                    </div>

                    {/* Info de contacto */}
                    <div className="px-6 py-5 flex flex-col gap-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Información de contacto</p>

                        <InfoRow icon={Mail}    label="Correo electrónico" value={clientData.email} />
                        <InfoRow icon={Phone}   label="Teléfono"           value={clientData.telefono} />
                        <InfoRow icon={MapPin}  label="Dirección"          value={clientData.direccion} />
                    </div>

                    {/* Info del registro */}
                    <div className="px-6 pb-5 flex flex-col gap-4 border-t border-gray-50 pt-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registro</p>

                        <InfoRow icon={CreditCard} label="ID de cliente"    value={`#${clientData.id}`} />
                        <InfoRow icon={User}       label="Empresa ID"       value={`#${clientData.empresa_id}`} />
                        <InfoRow
                            icon={User}
                            label="Fecha de registro"
                            value={
                                clientData.fecha_registro && clientData.fecha_registro !== '0000-00-00'
                                    ? clientData.fecha_registro
                                    : null
                            }
                        />
                    </div>
                </div>

                {/* Footer con acciones */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-gray-200 text-gray-500 hover:bg-gray-50"
                    >
                        Cerrar
                    </Button>
                    <Button
                        onClick={handleEdit}
                        className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold flex items-center gap-2"
                    >
                        <Pencil size={15} />
                        Editar
                    </Button>
                </div>

            </div>
        </>
    )
}
