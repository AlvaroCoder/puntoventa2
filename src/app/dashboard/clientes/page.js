'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Loader2, Upload, Search, Plus, Users, Mail, Phone, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import SliderFormNewClient from '@/components/Forms/SliderFormNewClient'
import SliderFormEditClient from '@/components/Forms/SliderFormEditClient'
import SliderClientData from '@/components/Cards/SliderClientData'
import ImportExcelModal from '@/components/Modal/ImportExcelModal'
import { getClientesByEmpresa, deleteCliente } from '@/Connections/clientes'
import Image from 'next/image'
import Link from 'next/link'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import NegativeButton from '@/components/Buttons/NegativeButton'
import { useRouter } from 'next/navigation'

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

const AVATAR_COLORS = [
    '#1F4363',
    '#1B8D7C',
    '#FE811F',
    '#6366f1',
    '#0891b2',
    '#7c3aed',
    '#be185d',
]

function getAvatarColor(name = '') {
    const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

function ClientCard({ client, onSelect, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false)

    const nombre    = client.nombre_completo ?? '—'
    const initials  = nombre.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
    const avatarBg  = getAvatarColor(nombre)
    const catClass  = CATEGORIA_BADGE[client.categoria] ?? null
    const docClass  = TIPO_DOC_BADGE[client.tipo_documento] ?? 'bg-gray-100 text-gray-500'

    const handleDelete = async () => {
        setMenuOpen(false)
        try {
            await deleteCliente(client.id)
            onDelete(client.id)
            toast.success('Cliente eliminado')
        } catch {
            toast.error('No se pudo eliminar el cliente')
        }
    }

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">

            <button
                onClick={() => onSelect(client)}
                className="flex flex-col items-center text-center px-5 pt-6 pb-4 gap-3 flex-1 w-full focus:outline-none"
            >
                {client.foto_url ? (
                    <Image
                        src={client.foto_url}
                        alt={nombre}
                        height={50}
                        width={50}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow"
                    />
                ) : (
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 ring-2 ring-white shadow"
                        style={{ backgroundColor: avatarBg }}
                    >
                        {initials || '?'}
                    </div>
                )}

                <div className="w-full">
                    <p className="font-bold text-[#1F4363] text-sm leading-tight line-clamp-2">
                        {nombre}
                    </p>

                    <div className="flex items-center justify-center gap-1.5 mt-1.5 flex-wrap">
                        {client.tipo_documento && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${docClass}`}>
                                {client.tipo_documento}
                            </span>
                        )}
                        <span className="text-xs text-gray-400 font-mono">
                            {client.numero_documento ?? '—'}
                        </span>
                    </div>

                    {client.email && (
                        <div className="flex items-center justify-center gap-1 mt-1.5">
                            <Mail size={11} className="text-gray-300 shrink-0" />
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">
                                {client.email}
                            </p>
                        </div>
                    )}

                    {client.telefono && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                            <Phone size={11} className="text-gray-300 shrink-0" />
                            <p className="text-xs text-gray-400">{client.telefono}</p>
                        </div>
                    )}
                </div>

                {catClass && (
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${catClass}`}>
                        {client.categoria}
                    </span>
                )}
            </button>

            <div className="flex items-center border-t border-gray-50 divide-x divide-gray-50">
                <button
                    onClick={() => onEdit(client)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-gray-400 hover:text-[#1F4363] hover:bg-gray-50 transition-colors"
                >
                    <Pencil size={13} />
                    Editar
                </button>

                <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                    <PopoverTrigger asChild>
                        <button className="px-4 py-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                            <MoreHorizontal size={15} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-44 p-1 rounded-xl shadow-lg border border-gray-100">
                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                            Eliminar
                        </button>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

function EmptyState({ query }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1F4363]/5 flex items-center justify-center">
                <Users size={24} className="text-[#1F4363]/40" />
            </div>
            <p className="font-semibold text-[#1F4363] text-sm">
                {query ? 'Sin resultados' : 'Sin clientes aún'}
            </p>
            <p className="text-xs text-gray-400 max-w-[220px]">
                {query
                    ? `No se encontraron clientes para "${query}"`
                    : 'Agrega tu primer cliente con el botón Nuevo Cliente'
                }
            </p>
        </div>
    )
}

export default function Page() {
    const { user } = useAuth()
    const router = useRouter();
    const [dataClient, setDataClient]     = useState([])
    const [loading, setLoading]           = useState(true)
    const [queryInput, setQueryInput]     = useState('')
    const [clientSelected, setClientSelected] = useState(null)
    const [clientToEdit, setClientToEdit] = useState(null)
    const [showForm, setShowForm]         = useState(false)
    const [showImport, setShowImport]     = useState(false)

    useEffect(() => {
        if (!user?.access_token) return

        async function getData() {
            try {
                const res = await getClientesByEmpresa(user.empresa_id)
                setDataClient(res?.data?.data ?? [])
            } catch {
                toast.error('Error al cargar los clientes')
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [user])

    const filteredData = useMemo(() =>
        (dataClient ?? []).filter(c =>
            (c?.nombre_completo ?? '').toUpperCase().includes(queryInput.toUpperCase()) ||
            (c?.numero_documento ?? '').includes(queryInput)
        ),
    [dataClient, queryInput])

    const handleAddClient = newClient => {
        setDataClient(prev => [newClient, ...prev])
        setShowForm(false)
    }

    const handleEditFromTable = cliente => {
        setClientSelected(null)
        setClientToEdit(cliente)
    }

    const handleEditFromPanel = cliente => {
        setClientSelected(null)
        setClientToEdit(cliente)
    }

    const handleUpdateClient = updatedClient => {
        setDataClient(prev =>
            prev.map(c => c.id === updatedClient.id ? updatedClient : c)
        )
        setClientToEdit(null)
    }

    const handleDeleteClient = deletedId => {
        setDataClient(prev => prev.filter(c => c.id !== deletedId))
    }

    return (
        <div className="w-full p-8">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-bold text-[#1F4363] text-2xl">Clientes</h1>
                    <p className="text-sm text-gray-400">
                        Gestiona la cartera de tus clientes
                        {!loading && (
                            <span className="ml-2 text-xs font-semibold bg-[#1F4363]/8 text-[#1F4363] px-2 py-0.5 rounded-full">
                                {dataClient.length}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <NegativeButton
                        handleClick={() => setShowImport(true)}
                    >
                        Importar Excel
                    </NegativeButton>
                    <PrimaryButton
                        handleClick={()=>router.push("/dashboard/clientes/crear")}
                    >
                        Nuevo Cliente
                    </PrimaryButton>
                </div>
            </div>

            <div className="relative max-w-sm mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Buscar por nombre o documento..."
                    value={queryInput}
                    onChange={e => setQueryInput(e.target.value)}
                    className="pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-56">
                    <Loader2 className="animate-spin text-[#1F4363]" size={32} />
                </div>
            ) : filteredData.length === 0 ? (
                <EmptyState query={queryInput} />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredData.map(client => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onSelect={setClientSelected}
                            onEdit={handleEditFromTable}
                            onDelete={handleDeleteClient}
                        />
                    ))}
                </div>
            )}

            <SliderClientData
                open={!!clientSelected}
                onClose={() => setClientSelected(null)}
                clientData={clientSelected}
                onEdit={handleEditFromPanel}
            />

            <SliderFormEditClient
                open={!!clientToEdit}
                onClose={() => setClientToEdit(null)}
                clientData={clientToEdit}
                onSuccess={handleUpdateClient}
            />

            <SliderFormNewClient
                open={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={handleAddClient}
            />

            <ImportExcelModal
                open={showImport}
                onClose={() => setShowImport(false)}
            />
        </div>
    )
}