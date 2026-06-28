'use client'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Upload, ChevronRight, ChevronLeft, Loader2, CheckCircle, XCircle, FileSpreadsheet } from 'lucide-react'

const STEPS = ['Descargar plantilla', 'Subir archivo', 'Confirmar importación']

const PREVIEW_MOCK = [
    { nombre: 'Arroz Extra 5kg',  codigo: 'PRD-0001', precio: 'S/ 12.50', stock: 50, estado: 'ok' },
    { nombre: 'Azúcar Blanca 1kg', codigo: 'PRD-0002', precio: 'S/ 8.00',  stock: 30, estado: 'ok' },
    { nombre: '',                  codigo: 'PRD-0003', precio: 'S/ 5.00',  stock: 10, estado: 'error', error: 'Nombre vacío' },
    { nombre: 'Aceite Vegetal',    codigo: '',          precio: 'S/ 9.50',  stock: 20, estado: 'error', error: 'Código vacío' },
]

export default function ModalImportarExcelInventario({ open, onClose }) {
    const [step, setStep]         = useState(0)
    const [file, setFile]         = useState(null)
    const [dragging, setDragging] = useState(false)
    const [importing, setImporting] = useState(false)

    const okRows  = PREVIEW_MOCK.filter(r => r.estado === 'ok')
    const errRows = PREVIEW_MOCK.filter(r => r.estado === 'error')

    const handleDrop = e => {
        e.preventDefault()
        setDragging(false)
        const dropped = e.dataTransfer.files[0]
        if (dropped && (dropped.name.endsWith('.xlsx') || dropped.name.endsWith('.csv'))) {
            setFile(dropped)
        } else {
            toast.warn('Solo se aceptan archivos .xlsx o .csv')
        }
    }

    const handleConfirm = async () => {
        setImporting(true)
        await new Promise(r => setTimeout(r, 1500))
        setImporting(false)
        toast.success(`${okRows.length} productos importados correctamente`)
        handleClose()
    }

    const handleClose = () => {
        setStep(0)
        setFile(null)
        setDragging(false)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">

                {/* Header + Stepper */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-[#1F4363] font-bold text-lg">
                        Importar desde Excel
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-400 mt-0.5">
                        Sube un archivo Excel o CSV con tus productos
                    </DialogDescription>

                    {/* Stepper */}
                    <div className="flex items-center gap-1 mt-4">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={i}>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                            i < step  ? 'bg-[#FF821E] text-white' :
                                            i === step ? 'bg-[#FF821E] text-white' :
                                            'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {i < step ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-xs font-medium hidden sm:block truncate ${i === step ? 'text-[#1F4363]' : 'text-gray-400'}`}>
                                        {s}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-px mx-1 transition-colors ${i < step ? 'bg-[#FF821E]' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-5">

                    {/* ── Paso 1: Plantilla ── */}
                    {step === 0 && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-[#1F4363]/5 rounded-xl p-4">
                                <p className="text-sm font-semibold text-[#1F4363] mb-3">Columnas requeridas</p>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {[
                                        'nombre *', 'codigo *', 'precio_venta *',
                                        'categoria', 'codigo_barras', 'descripcion',
                                        'stock_inicial', 'stock_minimo',
                                    ].map(col => (
                                        <span key={col} className="font-mono text-xs bg-white px-2 py-1 rounded-lg border border-gray-100 text-gray-600">
                                            {col}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">* campos obligatorios</p>
                            </div>

                            <a href="/assets/plantilla_productos.xlsx" download>
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center gap-2 border-[#1F4363] text-[#1F4363] hover:bg-[#1F4363] hover:text-white"
                                >
                                    <Download size={16} />
                                    Descargar plantilla .xlsx
                                </Button>
                            </a>

                            <Button
                                onClick={() => setStep(1)}
                                className="w-full bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold flex items-center justify-center gap-2"
                            >
                                Siguiente
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )}

                    {/* ── Paso 2: Subir archivo ── */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <div
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('inv-excel-input').click()}
                                className={`border-2 border-dashed rounded-xl px-6 py-12 text-center cursor-pointer transition-colors ${
                                    dragging      ? 'border-[#FF821E] bg-[#FF821E]/5' :
                                    file          ? 'border-green-400 bg-green-50' :
                                    'border-gray-200 hover:border-[#FF821E]/40 hover:bg-gray-50/50'
                                }`}
                            >
                                <input
                                    id="inv-excel-input"
                                    type="file"
                                    accept=".xlsx,.csv"
                                    className="hidden"
                                    onChange={e => setFile(e.target.files[0] ?? null)}
                                />
                                <FileSpreadsheet
                                    size={36}
                                    className={`mx-auto mb-3 ${file ? 'text-green-500' : 'text-gray-300'}`}
                                />
                                {file ? (
                                    <>
                                        <p className="text-sm font-semibold text-green-600">{file.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">Archivo listo para procesar</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-gray-500">Arrastra tu archivo aquí</p>
                                        <p className="text-xs text-gray-400 mt-1">o haz clic para seleccionar (.xlsx, .csv)</p>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(0)}
                                    className="flex-1 flex items-center justify-center gap-1 border-gray-200 text-gray-500 hover:bg-gray-50"
                                >
                                    <ChevronLeft size={15} /> Anterior
                                </Button>
                                <Button
                                    disabled={!file}
                                    onClick={() => setStep(2)}
                                    className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold flex items-center justify-center gap-1"
                                >
                                    Procesar archivo <ChevronRight size={15} />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Paso 3: Confirmar ── */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            {/* Resumen */}
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    <CheckCircle size={13} /> {okRows.length} listos
                                </span>
                                {errRows.length > 0 && (
                                    <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                                        <XCircle size={13} /> {errRows.length} con errores
                                    </span>
                                )}
                            </div>

                            {/* Preview tabla */}
                            <div className="border border-gray-100 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-3 py-2 text-left text-gray-500 font-semibold">Nombre</th>
                                            <th className="px-3 py-2 text-left text-gray-500 font-semibold">Código</th>
                                            <th className="px-3 py-2 text-left text-gray-500 font-semibold">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {PREVIEW_MOCK.map((row, i) => (
                                            <tr key={i} className={row.estado === 'error' ? 'bg-red-50/40' : ''}>
                                                <td className="px-3 py-2.5 font-medium text-[#1F4363]">
                                                    {row.nombre || <span className="text-gray-300 italic">vacío</span>}
                                                </td>
                                                <td className="px-3 py-2.5 font-mono text-gray-500">
                                                    {row.codigo || <span className="text-gray-300 italic">vacío</span>}
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    {row.estado === 'ok' ? (
                                                        <span className="text-green-600 font-semibold flex items-center gap-1">
                                                            <CheckCircle size={12} /> OK
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-500 font-semibold flex items-center gap-1">
                                                            <XCircle size={12} /> {row.error}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-xs text-gray-400 text-center">
                                Se importarán <span className="font-bold text-[#1F4363]">{okRows.length}</span> productos.{' '}
                                {errRows.length > 0 && `Las ${errRows.length} filas con errores serán omitidas.`}
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="flex-1 flex items-center justify-center gap-1 border-gray-200 text-gray-500 hover:bg-gray-50"
                                >
                                    <ChevronLeft size={15} /> Anterior
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    disabled={importing || okRows.length === 0}
                                    className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold flex items-center justify-center gap-2"
                                >
                                    {importing
                                        ? <Loader2 size={14} className="animate-spin" />
                                        : <Upload size={14} />
                                    }
                                    Confirmar importación
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    )
}