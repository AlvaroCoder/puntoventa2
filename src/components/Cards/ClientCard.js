import { deleteCliente } from "@/Connections/clientes";
import { Mail, MoreHorizontal, Pencil, Phone, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const AVATAR_COLORS = [
    '#1F4363',
    '#1B8D7C',
    '#FE811F',
    '#6366f1',
    '#0891b2',
    '#7c3aed',
    '#be185d',
];

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

function getAvatarColor(name = '') {
    const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

export function ClientCard({client, onSelect, onEdit, onDelete}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const nombre = client?.nombre_completo ?? '-';
    const initials = nombre?.split('-').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
    const avatarBg = getAvatarColor(nombre);
    const catClass = CATEGORIA_BADGE[client?.categoria] ?? null;
    const docClass = TIPO_DOC_BADGE[clien.tipo_documento] ?? 'bg-gray-100 text-gray-500';

    const handleDelete = async () => {
        setMenuOpen(false);
        try {
            await deleteCliente(client?.id);
            onDelete(client?.id);
            toast.success('Cliente eliminado');
        } catch  {
            toast.error('No se pudo eliminar el cliente');
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