'use client'
import { useState } from 'react'
import { Wand2, Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Field } from '@/components/Inputs/Field'
import { useGenerarCodigo } from '@/hooks/useGenerarCodigo'

/**
 * SeccionBasica — campos de nombre, código, código de barras, categoría y descripción.
 * Props:
 *   form: object
 *   errors: object
 *   onChange: (name, value) => void
 *   categorias: Array<{ id, nombre }>
 *   loadingCategorias: boolean
 */
export default function SeccionBasica({ form, errors, onChange, categorias = [], loadingCategorias = false }) {
    const { generarCodigo } = useGenerarCodigo()
    const [modalCat, setModalCat] = useState(false)
    const [nuevaCat, setNuevaCat] = useState('')

    const handleGenerar = () => {
        if (!form.nombre.trim()) return
        const codigo = generarCodigo(form.nombre)
        onChange('codigo', codigo)
    }

    const handleGuardarCat = () => {
        // Mock: no llama API, solo cierra el modal
        setModalCat(false)
        setNuevaCat('')
    }

    return (
        <div className="space-y-5">
            <Field label="Nombre del producto" required error={errors.nombre}>
                <Input
                    name="nombre"
                    value={form.nombre}
                    onChange={e => onChange('nombre', e.target.value)}
                    placeholder="Ej: Zapatilla Nike Air Max"
                    className={`focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errors.nombre ? 'border-red-400' : ''}`}
                />
            </Field>

            <Field label="Código interno" required error={errors.codigo}>
                <div className="flex gap-2">
                    <Input
                        name="codigo"
                        value={form.codigo}
                        onChange={e => onChange('codigo', e.target.value)}
                        placeholder="Ej: ZAP-NIK-001"
                        className={`flex-1 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${errors.codigo ? 'border-red-400' : ''}`}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerar}
                        className="shrink-0 flex items-center gap-1.5 border-[#1F4363]/30 text-[#1F4363] hover:bg-[#1F4363]/5 text-xs font-semibold px-3"
                    >
                        <Wand2 size={13} />
                        Generar
                    </Button>
                </div>
                <p className="text-[11px] text-gray-400 -mt-1">
                    Basado en el nombre: &quot;Zapatilla Nike Air&quot; → ZAP-NIK-AIR-001
                </p>
            </Field>

            <Field label="Código de barras" error={errors.codigo_barras}>
                <Input
                    name="codigo_barras"
                    value={form.codigo_barras}
                    onChange={e => onChange('codigo_barras', e.target.value)}
                    placeholder="Ej: 7501055300439"
                    className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                />
            </Field>

            <Field label="Categoría" error={errors.categoria_id}>
                <div className="relative">
                    {loadingCategorias ? (
                        <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                    ) : (
                        <select
                            value={form.categoria_id ?? ''}
                            onChange={e => {
                                const val = e.target.value
                                if (val === '__nueva__') {
                                    setModalCat(true)
                                } else {
                                    onChange('categoria_id', val || null)
                                }
                            }}
                            className={`w-full h-9 px-3 pr-8 rounded-lg border bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] transition-all
                                ${errors.categoria_id ? 'border-red-400' : 'border-gray-200'}`}
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                            <option value="__nueva__">+ Nueva categoría</option>
                        </select>
                    )}
                    <div className="pointer-events-none absolute right-2.5 top-2.5 border-l border-gray-200 pl-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </Field>

            <Field label="Descripción" error={errors.descripcion}>
                <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={e => onChange('descripcion', e.target.value)}
                    placeholder="Describe brevemente el producto..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#1F4363] placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] transition-all"
                />
            </Field>

            {/* Modal nueva categoría (mock) */}
            <Dialog open={modalCat} onOpenChange={setModalCat}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-[#1F4363]">Nueva categoría</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <Field label="Nombre de la categoría" required>
                            <Input
                                value={nuevaCat}
                                onChange={e => setNuevaCat(e.target.value)}
                                placeholder="Ej: Calzado deportivo"
                                className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                            />
                        </Field>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setModalCat(false)} className="text-sm">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleGuardarCat}
                            className="bg-[#FF821E] hover:bg-[#FF821E]/90 text-white text-sm"
                        >
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
