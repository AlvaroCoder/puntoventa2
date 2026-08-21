'use client';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '../ui/dropdown-menu'
import { useAuth } from '@/Context/AuthContext'
import { logout } from '@/lib/authentication'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import BadgeIcon from '@mui/icons-material/Badge'
import LogoutIcon from '@mui/icons-material/Logout'
import { Search, Bell } from 'lucide-react'

const NIVEL_LABEL = {
    999: { label: 'Dueño',         color: 'bg-[#FE811F]/15 text-[#FE811F]' },
    4:   { label: 'Administrador', color: 'bg-[#1F4363]/10 text-[#1F4363]' },
    3:   { label: 'Supervisor',    color: 'bg-purple-100 text-purple-700'   },
    2:   { label: 'Cajero',        color: 'bg-teal-100 text-teal-700'       },
    1:   { label: 'Vendedor',      color: 'bg-gray-100 text-gray-600'       },
    0:   { label: 'Invitado',      color: 'bg-gray-100 text-gray-400'       },
}

export default function TopBarNavigationDashbord() {
    const { user } = useAuth()
    const initials  = user?.nombre_completo?.split(' ').map(n => n[0]?.toUpperCase()).join('') || ''
    const nivelInfo = NIVEL_LABEL[user?.nivel_permiso] ?? NIVEL_LABEL[0]
    const URL_LOGO_PUNTO_VENTA = "https://res.cloudinary.com/dabyqnijl/image/upload/v1787111787/puntoVenta360/Logo_Punto_Venta_wrgis4.png"
    return (
        <nav className="w-full h-20 bg-white sticky top-0 z-10 flex items-center justify-between px-6 shrink-0 border-b border-gray-100 shadow-sm">

            {/* Logo */}
            <Link href="/dashboard/bd/home" className="flex items-center gap-2.5">
                <Image
                    src={URL_LOGO_PUNTO_VENTA}
                    alt="Logo Punto de Venta 360"
                    width={88}
                    height={34}
                />
                <span className="text-base font-bold text-[#1F4363]">
                    Punto de Venta <span className="text-[#FE811F]">360</span>
                </span>
            </Link>

            {/* Acciones derechas */}
            <div className="flex items-center gap-1">

                {/* Buscar */}
                <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1F4363] hover:bg-gray-100 transition-colors">
                    <Search size={17} />
                </button>

                {/* Notificaciones */}
                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1F4363] hover:bg-gray-100 transition-colors">
                    <Bell size={17} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FE811F]" />
                </button>

                {/* Perfil */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="ml-1 w-9 h-9 rounded-full bg-[#1F4363] flex items-center justify-center text-white font-bold text-xs shrink-0 hover:bg-[#1a3557] transition-colors focus:outline-none">
                            {initials || <PersonOutlineIcon style={{ fontSize: 17 }} />}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64 p-2 shadow-lg border border-gray-100 rounded-xl mt-1">

                        {/* Header del perfil */}
                        <div className="flex items-center gap-3 px-2 py-3">
                            <div className="w-10 h-10 rounded-full bg-[#1F4363] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {initials || <PersonOutlineIcon style={{ fontSize: 18 }} />}
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
                                <PersonOutlineIcon style={{ fontSize: 17 }} />
                                <span className="text-sm font-medium">Ver perfil</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-[#1F4363]/5 focus:bg-[#1F4363]/5">
                            <Link href="/dashboard/notificaciones" className="flex items-center gap-3 text-[#1F4363]">
                                <NotificationsNoneIcon style={{ fontSize: 17 }} />
                                <span className="text-sm font-medium">Notificaciones</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="rounded-lg cursor-pointer px-3 py-2.5 hover:bg-[#1F4363]/5 focus:bg-[#1F4363]/5">
                            <div className="flex items-center gap-3 text-[#1F4363]">
                                <BadgeIcon style={{ fontSize: 17 }} />
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
                                    <LogoutIcon style={{ fontSize: 17 }} />
                                    <span className="text-sm font-medium">Cerrar sesión</span>
                                </button>
                            </form>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </nav>
    )
}