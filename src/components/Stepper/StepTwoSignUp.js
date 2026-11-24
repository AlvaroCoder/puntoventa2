import InputField from '@/elements/InputField'
import { User, Phone, CreditCard } from 'lucide-react'
import React from 'react'

const TIPOS_DOCUMENTO = [
    { value: 'DNI',       label: 'DNI' },
    { value: 'CE',        label: 'Carnet de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
]

export default function StepTwoSignUp({ formData, handleInputChange, errors }) {
    return (
        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
            <div className="mb-2">
                <h2 className="text-xl font-bold text-[#1F4363]">Datos personales</h2>
                <p className="text-gray-500 text-sm">Cuéntanos un poco sobre ti.</p>
            </div>

            <InputField
                label="Nombre completo"
                icon={User}
                name="nombre_completo"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre_completo}
                onChange={handleInputChange}
                obligatory
                error={errors?.nombre_completo}
            />

            <div className="flex gap-3">
                <div className="flex flex-col gap-1 w-44 shrink-0">
                    <label className="text-xs font-bold text-[#333]">
                        Tipo documento <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="tipo_documento"
                        value={formData.tipo_documento}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1F4363] bg-white focus:outline-none focus:ring-2 focus:ring-[#FE811F]/30 focus:border-[#FE811F]"
                    >
                        {TIPOS_DOCUMENTO.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <InputField
                        label="Número de documento"
                        icon={CreditCard}
                        name="numero_documento"
                        placeholder="Ej: 71234567"
                        value={formData.numero_documento}
                        onChange={handleInputChange}
                        obligatory
                        error={errors?.numero_documento}
                    />
                </div>
            </div>

            <InputField
                label="Teléfono"
                icon={Phone}
                name="telefono"
                type="tel"
                placeholder="Ej: 987654321"
                value={formData.telefono}
                onChange={handleInputChange}
                obligatory
                error={errors?.telefono}
            />
        </div>
    )
}
