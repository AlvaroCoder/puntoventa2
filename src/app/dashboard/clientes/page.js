'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Loader2, X, Download, Upload, ShoppingCart, CreditCard, Search, Plus, ChevronDown } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { TableClientsData } from '@/components/Tables/elements'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SliderFormNewClient from '@/components/Forms/SliderFormNewClient'
import ImportExcelModal from '@/components/Modal/ImportExcelModal'
import ClientHistorialPanel from '@/components/Panel/ClientHistorialPanel'

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
                });


                const json = await res.json();

                console.log('JSON : ', json);
                
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

            {clientSelected && (
                <ClientHistorialPanel   
                    client={clientSelected}
                    onClose={() => setClientSelected(null)}
                />
            )}

            <SliderFormNewClient
                open={showForm}
                onClose={() => setShowForm(false)}
                empresaId={user?.empresa_id}
                onSuccess={handleAddClient}
            />

            <ImportExcelModal
                open={showImport}
                onClose={() => setShowImport(false)}
            />
        </div>
    )
}
