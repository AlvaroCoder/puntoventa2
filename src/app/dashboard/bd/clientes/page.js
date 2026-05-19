'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Loader2, Upload, Search, Plus } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { TableClientsData } from '@/components/Tables/elements'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SliderFormNewClient from '@/components/Forms/SliderFormNewClient'
import SliderFormEditClient from '@/components/Forms/SliderFormEditClient'
import SliderClientData from '@/components/Cards/SliderClientData'
import ImportExcelModal from '@/components/Modal/ImportExcelModal'
import { getClientesByEmpresa } from '@/Connections/clientes'

export default function Page() {
    const { user } = useAuth()

    const [dataClient, setDataClient] = useState([])
    const [loading, setLoading] = useState(true)
    const [queryInput, setQueryInput] = useState('')
    const [clientSelected, setClientSelected] = useState(null)
    const [clientToEdit, setClientToEdit] = useState(null)

    const [showForm, setShowForm] = useState(false)
    const [showImport, setShowImport] = useState(false)

    useEffect(() => {
        if (!user?.access_token) return
        console.log('USUARIO : ', user?.access_token);
        
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
        <div className="w-full">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-bold text-[#1F4363] text-2xl">Cartera de Clientes</h1>
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

            <div className="relative max-w-sm mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Buscar por nombre o documento..."
                    value={queryInput}
                    onChange={e => setQueryInput(e.target.value)}
                    className="pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-56">
                        <Loader2 className="animate-spin text-[#1F4363]" size={32} />
                    </div>
                ) : (
                    <TableClientsData
                        data={filteredData}
                        handleClientSelected={setClientSelected}
                        onEdit={handleEditFromTable}
                        onDelete={handleDeleteClient}
                    />
                )}
            </div>

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
