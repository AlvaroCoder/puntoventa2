'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import KeyboardDoubleArrowLeftIcon  from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import StorageIcon from '@mui/icons-material/Storage'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import WorkIcon from '@mui/icons-material/Work'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon from '@mui/icons-material/Inventory'
import StoreIcon from '@mui/icons-material/Store'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PieChartIcon from '@mui/icons-material/PieChart'
import GroupIcon from '@mui/icons-material/Group'
import HomeIcon from '@mui/icons-material/Home';

const BD_ITEMS = [
    {routeName : 'Inicio',  routePath : '/dashboard/bd/home', routeIcon : HomeIcon},
    { routeName: 'Clientes', routePath: '/dashboard/bd/clientes',     routeIcon: PeopleIcon },
    { routeName: 'Créditos', routePath: '/dashboard/bd/creditos',     routeIcon: CreditCardIcon },
    { routeName: 'Caja', routePath: '/dashboard/bd/caja',         routeIcon: PointOfSaleIcon },
    { routeName: 'Trabajadores', routePath: '/dashboard/bd/trabajadores', routeIcon: WorkIcon },
    { routeName: 'Proveedores',  routePath: '/dashboard/bd/proveedores',  routeIcon: LocalShippingIcon },
    { routeName: 'Inventario', routePath: '/dashboard/bd/inventario',   routeIcon: InventoryIcon },
    { routeName: 'Tiendas', routePath: '/dashboard/bd/tiendas',      routeIcon: StoreIcon },
]

const GRAPH_ITEMS = [
    { routeName: 'Ventas', routePath: '/dashboard/graph/ventas',     routeIcon: TrendingUpIcon },
    { routeName: 'Finanzas', routePath: '/dashboard/graph/finanzas',   routeIcon: AccountBalanceWalletIcon },
    { routeName: 'Inventario', routePath: '/dashboard/graph/inventario', routeIcon: PieChartIcon },
    { routeName: 'Clientes', routePath: '/dashboard/graph/clientes',   routeIcon: GroupIcon },
]

export default function SidebarVisual() {
    const [open, setOpen] = useState(true)
    const pathname = usePathname()

    const mode      = pathname.startsWith('/dashboard/graph') ? 'graph' : 'bd'
    const navItems  = mode === 'bd' ? BD_ITEMS : GRAPH_ITEMS

    return (
        <div className={`${open ? 'w-56' : 'w-20'} bg-[#1F4363] h-screen flex flex-col justify-between relative z-50 duration-300 shrink-0`}>

            <button
                onClick={() => setOpen(!open)}
                className="absolute bg-white text-[#1F4363] rounded-full top-9 -right-3 border border-[#1F4363] cursor-pointer z-50 p-0.5 hover:bg-[#FF821E] hover:border-[#FF821E] hover:text-white transition-colors"
            >
                {open
                    ? <KeyboardDoubleArrowLeftIcon  style={{ fontSize: 18 }} />
                    : <KeyboardDoubleArrowRightIcon style={{ fontSize: 18 }} />
                }
            </button>

            <div>
                <div className={`flex items-center gap-2 px-4 py-6 border-b border-white/10 ${!open && 'justify-center'}`}>
                    <div className="w-8 h-8 bg-[#FF821E] rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-lg shrink-0">
                        360
                    </div>
                    {open && (
                        <span className="text-white font-bold tracking-tight text-sm truncate">
                            PUNTOVENTA
                        </span>
                    )}
                </div>

                <div className={`flex mt-4 mx-2 rounded-xl overflow-hidden border border-white/10 ${!open && 'flex-col'}`}>
                    <Link
                        href="/dashboard/bd/clientes"
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors
                            ${mode === 'bd'
                                ? 'bg-[#FF821E] text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <StorageIcon style={{ fontSize: 16 }} />
                        {open && <span>Datos</span>}
                    </Link>
                    <Link
                        href="/dashboard/graph/ventas"
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors
                            ${mode === 'graph'
                                ? 'bg-[#FF821E] text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <BarChartIcon style={{ fontSize: 16 }} />
                        {open && <span>Análisis</span>}
                    </Link>
                </div>

                {open && (
                    <p className="px-4 pt-5 pb-1 text-[10px] font-bold tracking-widest uppercase text-white/30">
                        {mode === 'bd' ? 'Base de Datos' : 'Visualizaciones'}
                    </p>
                )}

                <ul className={`flex flex-col gap-1 px-2 ${open ? 'mt-1' : 'mt-4'}`}>
                    {navItems.map((item, idx) => {
                        const Icon     = item.routeIcon
                        const isActive = pathname === item.routePath

                        return (
                            <Link key={idx} href={item.routePath}>
                                <li className={`
                                    list-none cursor-pointer px-3 py-2.5 rounded-xl flex flex-row items-center transition-colors
                                    ${!open && 'justify-center'}
                                    ${isActive
                                        ? 'bg-[#FF821E] text-white'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }
                                `}>
                                    <Icon style={{ fontSize: 20 }} />
                                    {open && (
                                        <p className={`ml-3 text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
                                            {item.routeName}
                                        </p>
                                    )}
                                </li>
                            </Link>
                        )
                    })}
                </ul>
            </div>

            {/* Footer */}
            <div className="px-2 pb-4 flex flex-col gap-2">
                {open && (
                    <p className="text-white/20 text-xs text-center">
                        <a href="https://www.alvacode.dev" rel="noreferrer" target="_blank">AlvaCode © 2026</a>
                    </p>
                )}
            </div>
        </div>
    )
}