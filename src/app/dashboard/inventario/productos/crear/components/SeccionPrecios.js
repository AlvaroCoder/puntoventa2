'use client'
import { AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
// import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Field } from '@/components/Inputs/Field'

const UNIDADES = [
    { value: 'UNIDAD',  label: 'Unidad' },
    { value: 'PAR',     label: 'Par' },
    { value: 'PQT3',    label: 'Paquete x3' },
    { value: 'DOCENA',  label: 'Docena' },
]

/**
 * SeccionPrecios — precio de venta, precio de compra, IGV y unidad de medida.
 * Props:
 *   form: object
 *   errors: object
 *   onChange: (name, value) => void
 *   alertaPrecioVenta: boolean — alerta cuando hay stock pero no precio
 */
export default function SeccionPrecios({ form, errors, onChange, alertaPrecioVenta = false }) {

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Precio de venta" error={errors.precio_venta}>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-sm text-gray-400 font-medium pointer-events-none">S/</span>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.precio_venta ?? ''}
                            onChange={e => onChange('precio_venta', e.target.value || null)}
                            placeholder="0.00"
                            className={`pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] transition-all
                                ${alertaPrecioVenta ? 'border-orange-400 focus-visible:border-orange-400 focus-visible:ring-orange-400/30' : ''}
                                ${errors.precio_venta ? 'border-red-400' : ''}`}
                        />
                    </div>
                    {alertaPrecioVenta && !errors.precio_venta && (
                        <div className="flex items-start gap-1.5 mt-1 p-2 bg-orange-50 rounded-lg border border-orange-200">
                            <AlertTriangle size={13} className="text-orange-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-orange-700">
                                Se requiere precio de venta cuando hay stock inicial.
                            </p>
                        </div>
                    )}
                </Field>

                <Field label="Precio de compra" error={errors.precio_compra}>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-sm text-gray-400 font-medium pointer-events-none">S/</span>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.precio_compra ?? ''}
                            onChange={e => onChange('precio_compra', e.target.value || null)}
                            placeholder="0.00"
                            className="pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>
                </Field>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                    <p className="text-sm font-semibold text-[#1F4363]">Aplica IGV (18%)</p>
                    <p className="text-xs text-gray-400 mt-0.5">El precio de venta incluye el impuesto</p>
                </div>
                <div className="flex items-center gap-2.5">
                    {form.aplica_igv && (
                        <Badge className="bg-[#198E7B]/10 text-[#198E7B] border-[#198E7B]/20 text-xs font-semibold">
                            IGV 18% incluido
                        </Badge>
                    )}

                </div>
            </div>

            <Field label="Unidad de medida" error={errors.unidad_medida}>
                <div className="relative">
                    <select
                        value={form.unidad_medida}
                        onChange={e => onChange('unidad_medida', e.target.value)}
                        className="w-full h-9 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] transition-all"
                    >
                        {UNIDADES.map(u => (
                            <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-2.5">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </Field>
        </div>
    )
}
