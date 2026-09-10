'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/Inputs/Field'
import TagsInput from './TagsInput'

const GENEROS = [
    { value: '',          label: 'Sin especificar' },
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO',  label: 'Femenino' },
    { value: 'UNISEX',    label: 'Unisex' },
    { value: 'NINO',      label: 'Niño' },
    { value: 'NINA',      label: 'Niña' },
]

const TEMPORADAS = [
    { value: '',          label: 'Sin especificar' },
    { value: 'TODO_ANIO', label: 'Todo el año' },
    { value: 'VERANO',    label: 'Verano' },
    { value: 'INVIERNO',  label: 'Invierno' },
    { value: 'ESCOLAR',   label: 'Escolar' },
    { value: 'NAVIDAD',   label: 'Navidad' },
]

const SelectField = ({ label, value, onChange, options }) => (
    <Field label={label}>
        <div className="relative">
            <select
                value={value ?? ''}
                onChange={e => onChange(e.target.value || null)}
                className="w-full h-9 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] transition-all"
            >
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-2.5">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </Field>
)

/**
 * SeccionClasificacion — sección colapsable: género, temporada, tipo, tags.
 * Props:
 *   form: object
 *   onChange: (name, value) => void
 */
export default function SeccionClasificacion({ form, onChange }) {
    const [abierto, setAbierto] = useState(false)

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setAbierto(prev => !prev)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <span className="text-sm font-semibold text-[#1F4363]">Clasificación</span>
                <span className="text-gray-400">
                    {abierto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
            </button>

            {abierto && (
                <div className="px-5 py-5 space-y-4 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SelectField
                            label="Género"
                            value={form.genero}
                            onChange={val => onChange('genero', val)}
                            options={GENEROS}
                        />
                        <SelectField
                            label="Temporada"
                            value={form.temporada}
                            onChange={val => onChange('temporada', val)}
                            options={TEMPORADAS}
                        />
                    </div>

                    <Field label="Tipo de producto">
                        <Input
                            value={form.tipo_producto ?? ''}
                            onChange={e => onChange('tipo_producto', e.target.value || null)}
                            placeholder="Ej: Deportivo, Casual, Formal..."
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </Field>

                    <Field label="Etiquetas (tags)">
                        <TagsInput
                            value={form.tags ?? []}
                            onChange={tags => onChange('tags', tags)}
                            placeholder="Escribe una etiqueta y presiona Enter..."
                        />
                        <p className="text-[11px] text-gray-400 mt-1">Presiona Enter o coma para agregar una etiqueta</p>
                    </Field>
                </div>
            )}
        </div>
    )
}
