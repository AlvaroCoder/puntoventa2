'use client'
import { motion, AnimatePresence } from 'framer-motion'

import { Input } from '@/components/ui/input'
import Field from '@/elements/Field'

/**
 * DatosOC — columna izquierda del formulario de orden de compra.
 * Props:
 *   form: object
 *   errors: object
 *   onChange: (name, value) => void
 *   proveedores: array
 *   tiendas: array
 *   loadingProveedores: boolean
 *   loadingTiendas: boolean
 */

const SelectNativo = ({ value, onChange, children, error, disabled = false }) => (
    <div className="relative">
        <select
            value={value ?? ''}
            onChange={e => onChange(e.target.value || null)}
            disabled={disabled}
            className={`w-full h-9 px-3 pr-8 rounded-lg border bg-white text-sm text-[#1F4363] appearance-none
                focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] transition-all
                ${error ? 'border-red-400' : 'border-gray-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-2.5">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
)

export default function DatosOC({
    form,
    errors,
    onChange,
    proveedores = [],
    tiendas = [],
    loadingProveedores = false,
    loadingTiendas = false,
}) {
    const esTipoAbierta = form.tipo_oc === 'ABIERTA'

    return (
        <div className="space-y-5">

            {/* Proveedor */}
            <Field label="Proveedor" required error={errors.proveedor_id}>
                {loadingProveedores ? (
                    <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                ) : proveedores.length === 0 ? (
                    <div className="flex flex-col gap-1.5">
                        <div className="h-9 flex items-center px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-400">
                            Sin proveedores registrados
                        </div>
                        <p className="text-xs text-gray-400">
                            No tienes proveedores aún.{' '}
                            <span className="text-[#FF821E] font-medium cursor-pointer hover:underline">
                                + Crear proveedor
                            </span>
                        </p>
                    </div>
                ) : (
                    <SelectNativo
                        value={form.proveedor_id}
                        onChange={val => onChange('proveedor_id', val)}
                        error={errors.proveedor_id}
                    >
                        <option value="">Seleccionar proveedor</option>
                        {proveedores.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.nombre ?? p.razon_social}
                            </option>
                        ))}
                    </SelectNativo>
                )}
            </Field>

            {/* Tienda */}
            <Field label="Tienda de destino" required error={errors.tienda_id}>
                {loadingTiendas ? (
                    <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                ) : (
                    <SelectNativo
                        value={form.tienda_id}
                        onChange={val => onChange('tienda_id', val)}
                        error={errors.tienda_id}
                    >
                        <option value="">Seleccionar tienda</option>
                        {tiendas.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </SelectNativo>
                )}
            </Field>

            {/* Tipo de OC — segmented control */}
            <Field label="Tipo de orden" required>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    {['ESTANDAR', 'ABIERTA'].map(tipo => (
                        <button
                            key={tipo}
                            type="button"
                            onClick={() => onChange('tipo_oc', tipo)}
                            className={`flex-1 py-2 text-sm font-semibold transition-colors
                                ${form.tipo_oc === tipo
                                    ? 'bg-[#1F4363] text-white'
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {tipo === 'ESTANDAR' ? 'Estándar' : 'Abierta'}
                        </button>
                    ))}
                </div>
            </Field>

            {/* Fecha estimada (solo para estándar, opcional) */}
            {!esTipoAbierta && (
                <Field label="Fecha estimada de entrega">
                    <Input
                        type="date"
                        value={form.fecha_estimada ?? ''}
                        onChange={e => onChange('fecha_estimada', e.target.value || null)}
                        className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] text-[#1F4363]"
                    />
                </Field>
            )}

            {/* Campos de vigencia para OC Abierta */}
            <AnimatePresence>
                {esTipoAbierta && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-4 pt-1">
                            <div className="px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-xs text-amber-700 font-medium">
                                    La orden abierta requiere un período de vigencia definido.
                                </p>
                            </div>

                            <Field label="Fecha inicio vigencia" required error={errors.fecha_vigencia_ini}>
                                <Input
                                    type="date"
                                    value={form.fecha_vigencia_ini ?? ''}
                                    onChange={e => onChange('fecha_vigencia_ini', e.target.value || null)}
                                    className={`focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] text-[#1F4363] ${errors.fecha_vigencia_ini ? 'border-red-400' : ''}`}
                                />
                            </Field>

                            <Field label="Fecha fin vigencia" required error={errors.fecha_vigencia_fin}>
                                <Input
                                    type="date"
                                    value={form.fecha_vigencia_fin ?? ''}
                                    min={form.fecha_vigencia_ini ?? ''}
                                    onChange={e => onChange('fecha_vigencia_fin', e.target.value || null)}
                                    className={`focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] text-[#1F4363] ${errors.fecha_vigencia_fin ? 'border-red-400' : ''}`}
                                />
                                {errors.fecha_vigencia_fin && !errors.fecha_vigencia_fin.includes('obligatorio') && (
                                    <p className="text-xs text-red-500 mt-0.5">{errors.fecha_vigencia_fin}</p>
                                )}
                            </Field>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Condiciones de pago */}
            <Field label="Condiciones de pago">
                <Input
                    value={form.condiciones_pago ?? ''}
                    onChange={e => onChange('condiciones_pago', e.target.value)}
                    placeholder="Ej: 30 días, al contado, 50% adelanto..."
                    className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                />
            </Field>

            {/* Observaciones */}
            <Field label="Observaciones">
                <textarea
                    value={form.observaciones ?? ''}
                    onChange={e => onChange('observaciones', e.target.value)}
                    placeholder="Notas adicionales para el proveedor..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#1F4363] placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] transition-all"
                />
            </Field>

        </div>
    )
}
