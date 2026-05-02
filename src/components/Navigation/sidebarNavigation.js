'use client'
import React, { useState } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoneyOff, Store, People, Inventory, PointOfSale } from '@mui/icons-material';

const NAV_ITEMS = [
    { routeName: "Inicio", routePath: "/dashboard", routeIcon: HomeIcon,    minNivel: 0 },
    { routeName: "Clientes", routePath: "/dashboard/clientes", routeIcon: PersonIcon,  minNivel: 1 },
    { routeName: "Creditos", routePath: "/dashboard/creditos", routeIcon: MoneyOff,    minNivel: 1 },
    { routeName: "Caja", routePath: "/dashboard/caja", routeIcon: PointOfSale, minNivel: 2 },
    { routeName: "Inventario", routePath: "/dashboard/inventario", routeIcon: Inventory,   minNivel: 3 },
    { routeName: "Tiendas", routePath: "/dashboard/tiendas", routeIcon: Store,       minNivel: 4 },
    { routeName: "Trabajadores", routePath: "/dashboard/trabajadores", routeIcon: People,      minNivel: 4 },
];

export default function SidebarNavigation() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const pathname = usePathname();

    return (
        <div className={`${openSidebar ? 'w-56' : 'w-20'} bg-[#1F4363] h-screen flex flex-col justify-between relative z-50 duration-300 shrink-0`}>
            <button
                onClick={() => setOpenSidebar(!openSidebar)}
                className="absolute bg-white text-[#1F4363] rounded-full top-9 -right-3 border border-[#1F4363] cursor-pointer z-50 p-0.5 hover:bg-[#FF821E] hover:border-[#FF821E] hover:text-white transition-colors"
            >
                {openSidebar
                    ? <KeyboardDoubleArrowLeftIcon style={{ fontSize: 18 }} />
                    : <KeyboardDoubleArrowRightIcon style={{ fontSize: 18 }} />
                }
            </button>
            <div>
                <div className={`flex items-center gap-2 px-4 py-6 border-b border-white/10 ${!openSidebar && 'justify-center'}`}>
                    <div className="w-8 h-8 bg-[#FF821E] rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-lg shrink-0">
                        360
                    </div>
                    {openSidebar && (
                        <span className="text-white font-bold tracking-tight text-sm truncate">
                            PUNTOVENTA
                        </span>
                    )}
                </div>
                <ul className="mt-4 flex flex-col gap-1 px-2">
                    {NAV_ITEMS.map((item, idx) => {
                        const Icon = item.routeIcon;
                        const isActive = pathname === item.routePath;
                        return (
                            <Link key={idx} href={item.routePath}>
                                <li className={`
                                    list-none cursor-pointer px-3 py-2.5 rounded-xl flex flex-row items-center transition-colors
                                    ${!openSidebar && 'justify-center'}
                                    ${isActive
                                        ? 'bg-[#FF821E] text-white'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'}
                                `}>
                                    <Icon style={{ fontSize: 20 }} />
                                    {openSidebar && (
                                        <p className={`ml-3 text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
                                            {item.routeName}
                                        </p>
                                    )}
                                </li>
                            </Link>
                        );
                    })}
                </ul>
            </div>

            <div className="px-2 pb-4">
                {openSidebar && (
                    <p className="text-white/30 text-xs text-center">
                        PipoApp © 2026
                    </p>
                )}
            </div>
        </div>
    );
}