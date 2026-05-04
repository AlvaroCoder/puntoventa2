'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Loader2, X, Download, Upload, ShoppingCart, CreditCard, Search, Plus, ChevronDown } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { CREATE_CLIENT } from '@/conexion/apiconexion'
import { getDataSunatClienteDni } from '@/conexion/sunat'
import { TableClientsData } from '@/components/Tables/elements'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import SliderFormNewClient from '@/components/Forms/SliderFormNewClient'

// ─── Constantes ──────────────────────────────────────────────────────────────

const TIPO_DOCUMENTO = [
    { value: 1, label: 'DNI' },
    { value: 2, label: 'RUC' },
    { value: 3, label: 'C.E.' },
    { value: 4, label: 'Pasaporte' },
]

const CATEGORIAS = ['RESPONSABLE', 'REGULAR', 'MOROSO', 'VIP']

const MOCK_COMPRAS = [
    { id: 1, fecha: '2026-04-10', producto: 'Laptop HP 15"',     monto: 2800, estado: 'Pagado'    },
    { id: 2, fecha: '2026-03-22', producto: 'Monitor LG 24"',    monto: 950,  estado: 'Pagado'    },
    { id: 3, fecha: '2026-02-15', producto: 'Teclado Mecánico',  monto: 320,  estado: 'Pagado'    },
    { id: 4, fecha: '2026-01-05', producto: 'Mouse Inalámbrico', monto: 120,  estado: 'Pagado'    },
]

const MOCK_CREDITOS = [
    { id: 1, fecha: '2026-04-10', monto: 2800, cuotas: 12, saldo: 1400,  estado: 'Vigente'   },
    { id: 2, fecha: '2026-03-22', monto: 950,  cuotas: 6,  saldo: 0,     estado: 'Cancelado' },
    { id: 3, fecha: '2025-11-01', monto: 500,  cuotas: 3,  saldo: 0,     estado: 'Cancelado' },
]

// ─── ImportExcelModal ─────────────────────────────────────────────────────────

function ImportExcelModal({ open, onClose }) {
    const [file, setFile]         = useState(null)
    const [dragging, setDragging] = useState(false)
    const [uploading, setUploading] = useState(false)

    const handleDrop = e => {
        e.preventDefault()
        setDragging(false)
        const dropped = e.dataTransfer.files[0]
        if (dropped && (dropped.name.endsWith('.xlsx') || dropped.name.endsWith('.xls'))) {
            setFile(dropped)
        } else {
            toast.warn('Solo se aceptan archivos .xlsx o .xls')
        }
    }

    const handleUpload = async () => {
        if (!file) { toast.warn('Selecciona un archivo primero'); return }
        setUploading(true)
        // Simulación — conectar al endpoint de importación cuando esté disponible
        await new Promise(r => setTimeout(r, 1500))
        setUploading(false)
        toast.success('Clientes importados correctamente')
        setFile(null)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-[#1F4363] font-bold text-lg">Importar Clientes</DialogTitle>
                    <DialogDescription className="text-sm text-gray-400 mt-0.5">
                        Sube un archivo Excel con los datos de tus clientes
                    </DialogDescription>
                </div>

                <div className="px-6 py-5 flex flex-col gap-4">
                    {/* Descargar plantilla */}
                    <div className="flex items-center justify-between bg-[#1F4363]/5 rounded-xl px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-[#1F4363]">Plantilla de ejemplo</p>
                            <p className="text-xs text-gray-400">Descarga y completa con tus datos</p>
                        </div>
                        <a href="/assets/plantilla_importar_clientes.xlsx" download>
                            <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-[#1F4363] text-[#1F4363] hover:bg-[#1F4363] hover:text-white">
                                <Download size={14} />
                                Descargar
                            </Button>
                        </a>
                    </div>

                    {/* Drop zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('excel-input').click()}
                        className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-colors ${
                            dragging
                                ? 'border-[#FF821E] bg-[#FF821E]/5'
                                : file
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-200 hover:border-[#FF821E]/50 hover:bg-gray-50'
                        }`}
                    >
                        <input
                            id="excel-input"
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={e => setFile(e.target.files[0] ?? null)}
                        />
                        <Upload size={28} className={`mx-auto mb-2 ${file ? 'text-green-500' : 'text-gray-300'}`} />
                        {file ? (
                            <>
                                <p className="text-sm font-semibold text-green-600">{file.name}</p>
                                <p className="text-xs text-gray-400 mt-1">Archivo listo para importar</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-gray-500">Arrastra tu archivo aquí</p>
                                <p className="text-xs text-gray-400 mt-1">o haz clic para seleccionar (.xlsx, .xls)</p>
                            </>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1 border-gray-200 text-gray-500">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                        >
                            {uploading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
                            Importar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── ClientHistorialPanel ─────────────────────────────────────────────────────

const ESTADO_BADGE = {
    'Pagado':    'bg-green-100 text-green-700',
    'Vigente':   'bg-blue-100 text-blue-700',
    'Cancelado': 'bg-gray-100 text-gray-500',
    'Vencido':   'bg-red-100 text-red-600',
}

function ClientHistorialPanel({ client, onClose }) {
    const [activeTab, setActiveTab] = useState('compras')

    const nombre = client?.nombre_completo
        ?? `${client?.nombre_cliente ?? ''} ${client?.apellido_cliente ?? ''}`.trim()
        ?? 'Cliente'

    const inicial = nombre[0]?.toUpperCase() ?? 'C'

    const totalDeuda = MOCK_CREDITOS.reduce((acc, c) => acc + (c.saldo ?? 0), 0)
    const totalCompras = MOCK_COMPRAS.reduce((acc, c) => acc + c.monto, 0)

    return (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header del cliente */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 bg-[#1F4363]/3">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1F4363] flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {inicial}
                    </div>
                    <div>
                        <h2 className="font-bold text-[#1F4363] text-base">{nombre}</h2>
                        <p className="text-sm text-gray-400">{client?.email ?? '—'} · {client?.telefono_cliente ?? client?.telefono ?? '—'}</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                    <X size={16} />
                </button>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                <div className="px-6 py-4">
                    <p className="text-xs text-gray-400 mb-0.5">Total compras</p>
                    <p className="font-bold text-[#1F4363]">S/ {totalCompras.toLocaleString()}</p>
                </div>
                <div className="px-6 py-4">
                    <p className="text-xs text-gray-400 mb-0.5">Saldo pendiente</p>
                    <p className={`font-bold ${totalDeuda > 0 ? 'text-red-500' : 'text-green-600'}`}>
                        S/ {totalDeuda.toLocaleString()}
                    </p>
                </div>
                <div className="px-6 py-4">
                    <p className="text-xs text-gray-400 mb-0.5">Categoría</p>
                    <p className="font-bold text-[#1F4363]">{client?.categoria ?? '—'}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                {[
                    { key: 'compras',  label: 'Historial de Compras',   icon: ShoppingCart },
                    { key: 'creditos', label: 'Historial Crediticio',    icon: CreditCard   },
                ].map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.key
                                    ? 'border-[#FF821E] text-[#FF821E]'
                                    : 'border-transparent text-gray-400 hover:text-[#1F4363]'
                            }`}
                        >
                            <Icon size={15} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Contenido del tab */}
            <div className="px-6 py-4">
                {activeTab === 'compras' && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                                <th className="pb-3 font-medium">Fecha</th>
                                <th className="pb-3 font-medium">Producto</th>
                                <th className="pb-3 font-medium text-right">Monto</th>
                                <th className="pb-3 font-medium text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_COMPRAS.map(c => (
                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 text-gray-500">{c.fecha}</td>
                                    <td className="py-3 font-medium text-[#1F4363]">{c.producto}</td>
                                    <td className="py-3 text-right font-semibold text-[#1F4363]">S/ {c.monto.toLocaleString()}</td>
                                    <td className="py-3 text-center">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADO_BADGE[c.estado] ?? ''}`}>
                                            {c.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'creditos' && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                                <th className="pb-3 font-medium">Fecha</th>
                                <th className="pb-3 font-medium text-right">Monto</th>
                                <th className="pb-3 font-medium text-center">Cuotas</th>
                                <th className="pb-3 font-medium text-right">Saldo</th>
                                <th className="pb-3 font-medium text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_CREDITOS.map(c => (
                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 text-gray-500">{c.fecha}</td>
                                    <td className="py-3 text-right font-semibold text-[#1F4363]">S/ {c.monto.toLocaleString()}</td>
                                    <td className="py-3 text-center text-gray-500">{c.cuotas}</td>
                                    <td className={`py-3 text-right font-bold ${c.saldo > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                        S/ {c.saldo.toLocaleString()}
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADO_BADGE[c.estado] ?? ''}`}>
                                            {c.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

// ─── Page principal ───────────────────────────────────────────────────────────

export default function Page() {
    const URL_GET_CLIENTS = process.env.NEXT_PUBLIC_URL_GET_CLIENTS
    const { user } = useAuth()

    const [dataClient, setDataClient]     = useState([])
    const [loading, setLoading]           = useState(true)
    const [clientSelected, setClientSelected] = useState(null)
    const [queryInput, setQueryInput]     = useState('')
    const [showForm, setShowForm]         = useState(false)
    const [showImport, setShowImport]     = useState(false)

    useEffect(() => {
        if (!user?.access_token) return
        async function getData() {
            try {
                setLoading(true)
                const res = await fetch(URL_GET_CLIENTS, {
                    method: 'GET',
                    headers: {
                        'Content-Type':  'application/json',
                        'Authorization': `Bearer ${user.access_token}`,
                    },
                    mode: 'cors',
                })
                const json = await res.json()
                setDataClient(json?.data ?? json ?? [])
            } catch {
                toast.error('Error al cargar los clientes')
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [user, URL_GET_CLIENTS])

    const filteredData = useMemo(() =>
        dataClient.filter(c =>
            (c?.nombre_cliente ?? c?.nombre_completo ?? '')
                .toUpperCase().includes(queryInput.toUpperCase()) ||
            (c?.apellido_cliente ?? '').toUpperCase().includes(queryInput.toUpperCase())
        ),
    [dataClient, queryInput])

    const handleAddClient = newClient => {
        setDataClient(prev => [newClient, ...prev])
    }

    return (
        <div className="w-full">

            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-bold text-[#1F4363] text-2xl">Clientes</h1>
                    <p className="text-sm text-gray-400">Gestiona la cartera de tus clientes</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowImport(true)}
                        className="flex items-center gap-2 border-[#1F4363] text-[#1F4363] hover:bg-[#1F4363] hover:text-white transition-colors"
                    >
                        <Upload size={16} />
                        Importar Excel
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                    >
                        <Plus size={16} />
                        Nuevo Cliente
                    </Button>
                </div>
            </div>

            {/* Buscador */}
            <div className="relative max-w-sm mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Buscar cliente..."
                    value={queryInput}
                    onChange={e => setQueryInput(e.target.value)}
                    className="pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                />
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-56">
                        <Loader2 className="animate-spin text-[#1F4363]" size={32} />
                    </div>
                ) : (
                    <TableClientsData
                        data={filteredData}
                        handleClientSelected={setClientSelected}
                    />
                )}
            </div>

            {/* Panel historial del cliente */}
            {clientSelected && (
                <ClientHistorialPanel
                    client={clientSelected}
                    onClose={() => setClientSelected(null)}
                />
            )}

            {/* Formulario deslizante */}
            <SliderFormNewClient
                open={showForm}
                onClose={() => setShowForm(false)}
                empresaId={user?.empresa_id}
                onSuccess={handleAddClient}
            />

            {/* Modal importar Excel */}
            <ImportExcelModal
                open={showImport}
                onClose={() => setShowImport(false)}
            />
        </div>
    )
}
