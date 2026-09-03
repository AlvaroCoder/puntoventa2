'use client'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import { Field } from '@/components/Inputs/Field'
import { IconInput } from '@/components/Inputs/IconInput'
import { createAlmacen } from '@/Connections/almacen'
import { useAuth } from '@/Context/AuthContext'
import { ChevronRight, Hash, Text, Warehouse } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const INITIAL = {
    tiendaId : 1,
    nombre: '',
    codigo: '',
    tipo: 'VITRINA',
    descripcion : ''
}
export default function Page() {
    const TIPO_ALMACEN =  ['VITRINA', 'PRINCIPAL', 'DEPOSITO', 'TRANSITO', 'VIRTUAL']
    const { user }  = useAuth()
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    }
    const validate = () => {
        const e = {}
        if (!form.nombre.trim())  e.nombre = 'El nombre de la tienda es obligatorio'
        if (!form.codigo.trim())  e.codigo  = 'El código de tienda es obligatorio'
        return e
    }
    const handleSave = async () => {
        const e = validate();

        setLoading(true);
        try {
            const payload = Object.fromEntries(
                Object.entries({ ...form, empresa_id: user?.empresa_id })
                    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
            );

            const res = await createAlmacen(payload);

            if (!res.ok || res.status > 400) {
                toast.error(res.message || 'No se pudo crear la tienda')
                return
            }
            toast.success('Tienda creada correctamente')
            router.push('/dashboard/tiendas')
        } catch {
            toast.error('Error inesperado al guardar')
        } finally {
            setLoading(false);
        }
    }
    return (
      <div className='w-full max-w-4xl mx-auto px-6 py-8'>
          <div className='flex items-center gap-2 text-sm text-azulClaro'>
              <Link href="/dashboard/almacenes" className='hover:text-azulClaro/90'>
                Almacénes
              </Link>
              <ChevronRight size={14} />
              <span className='text-azulMarino font-semibold'>Nuevo Almacén</span>
          </div>
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
              <div className='flex items-center gap-4 px-8 py-7 pb-6 border-b border-gray-100'>
                    <div className="w-12 h-12 rounded-xl bg-[#FE811F]/10 flex items-center justify-center shrink-0">
                    <Warehouse size={22} className='text-azulClaro' />
                    </div>
                    
                    <div className='flex-1'>
                        <input
                            name='nombre'
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder='Nombre del almacén'
                                className={`w-full text-2xl font-bold text-[#1F4363] placeholder-gray-300 border-b-2 pb-1 bg-transparent outline-none transition-colors
                                ${errors.nombre ? 'border-red-400' : 'border-gray-200 focus:border-[#FF821E]'}`}
                            />
                            {errors.nombre && (
                                <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
                            )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 px-8 py-7">
                        <Field label={"código del almacen"} required error={errors.codigo}> 
                            <IconInput
                                icon={Hash}
                                name="codigo"
                                placeholder="Ej: ALM-001"
                                value={form.codigo}
                                onChange={handleChange}
                                error={errors.codigo}
                            />
                        </Field>
                        <Field label={"TIpo de almacen"} required error={errors.tipo}> 
                            <IconInput
                                icon={Hash}
                                name="tipo"
                                placeholder="Ej: ALM-001"
                                value={form.tipo}
                                onChange={handleChange}
                                error={errors.tipo}
                            />
                        </Field>
                        <Field label={"Descripcion"} required error={errors.descripcion}>
                            <IconInput
                                icon={Text}
                                name="descripcion"
                                placeholder='Ej:Description'
                                value={form.descripcion}
                                onChange={handleChange}
                                error={errors.descripcion}
                            />
                        </Field>

                </div>
                    <div className='flex justify-end gap-2 mt-4'>
                    <PrimaryButton
                        handleClick={handleSave}
                    >
                            Guardar
                        </PrimaryButton>
                    </div>
          </div>
    </div>
  )
}
