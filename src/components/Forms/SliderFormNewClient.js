import { CREATE_CLIENT } from '@/conexion/apiconexion';
import { getDataSunatClienteDni } from '@/conexion/sunat';
import Button from '@/elements/Button';
import { ChevronDown, Loader2, Search, X } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Input } from '../ui/input';

export default function SliderFormNewClient({
    open, onClose, empresaId, onSuccess
}) {
    const INITIAL = {
        tipo_documento: 'DNI',
        numero_documento: '',
        nombre_completo: '',
        email: "",
        telefono: "",
        direccion: '',
        categoria : 'RESPONSABLE'
    }

    const [form, setForm] = useState(INITIAL);
    const [loadingSunat, setLoadingSunat] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);

    const handleChange = e => setForm({
        ...form,
        [e.target.name]: e.target.value
    });

    const handleSunat = async () => {
        if (!form?.numero_documento) { toast.error('Ingresa el número de documento'); return; }
        
        setLoadingSunat(true);
        try {
            const res = await getDataSunatClienteDni(form?.numero_documento);
            if (!res.ok) { toast.error('No se encontró el documento en la SUNAT'); return; };
            const json = await res.json();
            setForm(prev => ({
                ...prev,
                nombre_completo: `${json?.nombre ?? ''} ${json?.apellido ?? ''}`.trim()
            }));
            toast.success('Datos completados desde SUNAT');
        } catch {
            toast.error('Error al consultar SUNAT')
        } finally {
            setLoadingSunat(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { numero_documento, nombre_completo } = form;
        if (!numero_documento || !nombre_completo) {
            toast.warn('COmpleta los campos obligatorios');
            return;
        }

        setLoadingSave(false);

        try {
            const payload = {
                ...form,
                empresa_id: empresaId,
                tipo_documento: form?.tipo_documento,
                numero_documento: Number(form?.numero_documento),
                telefono: Number(form?.telefono)
            }
            const res = await CREATE_CLIENT(payload);

            if (!res.ok) {
                const json = await res.json();
                toast.error(json?.message ?? 'Error al crear el cliente');
                return;
            }
            const json = await res.json();
            toast.success('Cliente creado correctamente');
            onSuccess(json?.data ?? payload)
            setForm(INITIAL)
            onClose()
        } catch {
            toast.error('Errro insperado al guardar')
        } finally {
            setLoadingSave(false)
        }
    }

  return (
           <>
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="font-bold text-[#1F4363] text-lg">Nuevo Cliente</h2>
                        <p className="text-sm text-gray-400">Completa los datos del cliente</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

                    {/* Tipo + Número documento */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Documento <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="relative w-36 shrink-0">
                                <select
                                    name="tipo_documento"
                                    value={form.tipo_documento}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                >
                                    {TIPO_DOCUMENTO.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                            </div>
                            <Input
                                name="numero_documento"
                                type="number"
                                placeholder="Número de documento"
                                value={form.numero_documento}
                                onChange={handleChange}
                                className="flex-1 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSunat}
                                disabled={loadingSunat || form.tipo_documento != 1}
                                className="shrink-0 border-[#1F4363] text-[#1F4363] hover:bg-[#1F4363] hover:text-white"
                            >
                                {loadingSunat ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                            </Button>
                        </div>
                        {form.tipo_documento != 1 && (
                            <p className="text-xs text-gray-400 mt-1">La búsqueda en SUNAT solo está disponible para DNI</p>
                        )}
                    </div>

                    {/* Nombre completo */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Nombre completo <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="nombre_completo"
                            placeholder="Ej: Alvaro Felipe Pupuche Morales"
                            value={form.nombre_completo}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Correo electrónico
                        </label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={form.email}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Teléfono
                        </label>
                        <Input
                            name="telefono"
                            type="number"
                            placeholder="Ej: 920663473"
                            value={form.telefono}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Dirección
                        </label>
                        <Input
                            name="direccion"
                            placeholder="Ej: Av. Los Jardines 123"
                            value={form.direccion}
                            onChange={handleChange}
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1F4363] mb-1.5">
                            Categoría
                        </label>
                        <div className="relative">
                            <select
                                name="categoria"
                                value={form.categoria}
                                onChange={handleChange}
                                className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                            >
                                {CATEGORIAS.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-gray-200 text-gray-500 hover:bg-gray-50">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={loadingSave}
                        onClick={handleSubmit}
                        className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        {loadingSave ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                        Guardar cliente
                    </Button>
                </div>

            </div>
        </>
  )
}
