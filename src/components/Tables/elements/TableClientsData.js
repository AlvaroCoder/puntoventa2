'use client'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useMemo, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { deleteCliente } from '@/Connections/clientes';


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

const HEADERS = [
    { key: 'nombre_completo',  label: 'Cliente',         sortable: true  },
    { key: 'tipo_documento',   label: 'Documento',       sortable: false },
    { key: 'email',            label: 'Email',           sortable: false },
    { key: 'telefono',         label: 'Teléfono',        sortable: false },
    { key: 'categoria',        label: 'Categoría',       sortable: true  },
    { key: 'acciones',         label: '',                sortable: false },
]

function SortIcon({ field, sortField, sortDir }) {
    if (field !== sortField) return <ArrowUpDown size={13} className="ml-1 text-gray-300 inline" />
    if (sortDir === 'asc')   return <ArrowUp     size={13} className="ml-1 text-[#FF821E] inline" />
    return                          <ArrowDown   size={13} className="ml-1 text-[#FF821E] inline" />
}

function SkeletonRows() {
    return Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
            {HEADERS.map((_, j) => (
                <TableCell key={j}>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                </TableCell>
            ))}
        </TableRow>
    ))
}

export default function TableClientsData({
    data = [],
    handleClientSelected = () => { },
    onEdit = () => { },
    onDelete = () => { } }) {
    const [sortField, setSortField] = useState('nombre_completo')
    const [sortDir,   setSortDir]   = useState('asc')
    const [deleting,  setDeleting]  = useState(null)

    const handleSort = field => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDir('asc')
        }
    }

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const valA = (a[sortField] ?? '').toString().toLowerCase()
            const valB = (b[sortField] ?? '').toString().toLowerCase()
            const cmp  = valA.localeCompare(valB, 'es')
            return sortDir === 'asc' ? cmp : -cmp
        })
    }, [data, sortField, sortDir])

    const handleDelete = async (id) => {
        setDeleting(id)
        try {
            const res = await deleteCliente(id)
            if (!res.ok) { toast.error(res.message || 'Error al eliminar el cliente'); return }
            toast.success('Cliente eliminado')
            onDelete(id)
        } catch {
            toast.error('Error inesperado al eliminar')
        } finally {
            setDeleting(null)
        }
    }

    return (
        <section className="w-full">
            <Table>
                <TableCaption className="text-xs text-gray-400 pb-3">
                    {data.length} cliente{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}
                </TableCaption>

                <TableHeader>
                    <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                        {HEADERS.map(h => (
                            <TableHead key={h.key}>
                                {h.sortable ? (
                                    <button
                                        onClick={() => handleSort(h.key)}
                                        className="flex items-center font-semibold text-[#1F4363] text-xs uppercase tracking-wide hover:text-[#FF821E] transition-colors select-none"
                                    >
                                        {h.label}
                                        <SortIcon field={h.key} sortField={sortField} sortDir={sortDir} />
                                    </button>
                                ) : (
                                    <span className="font-semibold text-[#1F4363] text-xs uppercase tracking-wide">
                                        {h.label}
                                    </span>
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {sortedData.length === 0 ? (
                        <TableRow className="h-48">
                            <TableCell colSpan={HEADERS.length} className="text-center text-gray-400 text-sm">
                                No hay clientes para mostrar
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedData.map(cliente => (
                            <TableRow
                                key={cliente.id}
                                className="hover:bg-[#1F4363]/3 transition-colors cursor-pointer"
                            >
                                <TableCell>
                                    <button
                                        onClick={() => handleClientSelected(cliente)}
                                        className="text-left group"
                                    >
                                        <p className="font-medium text-[#1F4363] group-hover:text-[#FF821E] transition-colors text-sm">
                                            {cliente.nombre_completo}
                                        </p>
                                    </button>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${TIPO_DOC_BADGE[cliente.tipo_documento] ?? 'bg-gray-100 text-gray-500'}`}>
                                            {cliente.tipo_documento}
                                        </span>
                                        <span className="text-xs text-gray-500 font-mono">
                                            {cliente.numero_documento}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm text-gray-600 truncate max-w-[180px]">
                                        {cliente.email ?? <span className="text-gray-300">—</span>}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm text-gray-600 font-mono">
                                        {cliente.telefono ?? <span className="text-gray-300">—</span>}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORIA_BADGE[cliente.categoria] ?? 'bg-gray-100 text-gray-500'}`}>
                                        {cliente.categoria ?? '—'}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" className="w-8 h-8 p-0 hover:bg-gray-100">
                                                <MoreVertIcon style={{ fontSize: 18 }} />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-1.5 rounded-xl shadow-lg border border-gray-100">
                                            <div className="flex flex-col gap-0.5">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-between text-sm text-[#1F4363] hover:bg-[#1F4363]/5 rounded-lg px-3 h-9"
                                                    onClick={() => onEdit(cliente)}
                                                >
                                                    <span>Editar</span>
                                                    <EditIcon style={{ fontSize: 16 }} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    disabled={deleting === cliente.id}
                                                    className="w-full justify-between text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg px-3 h-9"
                                                    onClick={() => handleDelete(cliente.id)}
                                                >
                                                    <span>{deleting === cliente.id ? 'Eliminando...' : 'Eliminar'}</span>
                                                    <Trash size={14} />
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </section>
    )
}
