'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import Link from 'next/link'
import { logout } from '@/lib/authentication'
import { useAuth } from '@/Context/AuthContext'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';

const NIVEL_LABEL = {
    999: { label: 'Dueño',         color: 'bg-[#FF821E]/15 text-[#FF821E]' },
    4:   { label: 'Administrador', color: 'bg-[#1F4363]/10 text-[#1F4363]' },
    3:   { label: 'Supervisor',    color: 'bg-purple-100 text-purple-700'   },
    2:   { label: 'Cajero',        color: 'bg-teal-100 text-teal-700'       },
    1:   { label: 'Vendedor',      color: 'bg-gray-100 text-gray-600'       },
    0:   { label: 'Invitado',      color: 'bg-gray-100 text-gray-400'       },
};

function getInitials(name = '') {
    return name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0]?.toUpperCase() ?? '')
        .join('');
}

export default function ButtonDropdownProfile() {
    const { user, loading } = useAuth();

    const initials    = getInitials(user?.nombre_completo);
    const nivelInfo   = NIVEL_LABEL[user?.nivel_permiso] ?? NIVEL_LABEL[0];

    if (loading) {
        return (
            <div>
                <p>Cargando ...</p>
            </div>
        )
    }
        return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex flex-row items-center gap-3 min-h-14 px-3  rounded-xl hover:bg-[#1F4363]/5 transition-colors border border-transparent hover:border-gray-200"
                    >
                        <div className="w-9 h-9 rounded-full bg-[#1F4363] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {initials || <PersonOutlineIcon style={{ fontSize: 18 }} />}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                        <p className="font-semibold text-[#1F4363] text-sm leading-tight">
                            {user?.nombre_completo ?? 'Usuario'}
                        </p>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${nivelInfo.color}`}>
                            {nivelInfo.label}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-2 shadow-lg border border-gray-100 rounded-xl">

                {/* Header del perfil */}
                <div className="flex items-center gap-3 px-2 py-3">
                    <div className="w-12 h-12 rounded-full bg-[#1F4363] flex items-center justify-center text-white font-bold text-base shrink-0">
                        {initials || <PersonOutlineIcon />}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="font-bold text-[#1F4363] text-sm truncate">
                            {user?.nombre_completo ?? 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {user?.email ?? ''}
                        </p>
                        <span className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${nivelInfo.color}`}>
                            {nivelInfo.label}
                        </span>
                    </div>
                </div>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem asChild className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-[#1F4363]/5 focus:bg-[#1F4363]/5">
                    <Link href="/dashboard/perfil" className="flex items-center gap-3 text-[#1F4363]">
                        <PersonOutlineIcon style={{ fontSize: 18 }} />
                        <span className="text-sm font-medium">Ver perfil</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-[#1F4363]/5 focus:bg-[#1F4363]/5">
                    <Link href="/dashboard/notificaciones" className="flex items-center gap-3 text-[#1F4363]">
                        <NotificationsNoneIcon style={{ fontSize: 18 }} />
                        <span className="text-sm font-medium">Notificaciones</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-[#1F4363]/5 focus:bg-[#1F4363]/5">
                    <div className="flex items-center gap-3 text-[#1F4363]">
                        <BadgeIcon style={{ fontSize: 18 }} />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Nivel de acceso</span>
                            <span className="text-xs text-gray-400">Permiso {user?.nivel_permiso ?? 0}</span>
                        </div>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem asChild className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-red-50 focus:bg-red-50">
                    <form action={logout} className="w-full">
                        <button type="submit" className="flex items-center gap-3 text-red-500 w-full">
                            <LogoutIcon style={{ fontSize: 18 }} />
                            <span className="text-sm font-medium">Cerrar sesión</span>
                        </button>
                    </form>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}