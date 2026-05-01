'use client'
import React, { useState } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoneyOff, Store, People, Inventory, PointOfSale } from '@mui/icons-material';
import { useSession } from '@/hooks/useHooks';

const NAV_ITEMS = [
    { routeName: "Inicio",       routePath: "/dashboard",             routeIcon: HomeIcon,    minNivel: 0 },
    { routeName: "Clientes",     routePath: "/dashboard/clientes",    routeIcon: PersonIcon,  minNivel: 1 },
    { routeName: "Creditos",     routePath: "/dashboard/creditos",    routeIcon: MoneyOff,    minNivel: 1 },
    { routeName: "Caja",         routePath: "/dashboard/caja",        routeIcon: PointOfSale, minNivel: 2 },
    { routeName: "Inventario",   routePath: "/dashboard/inventario",  routeIcon: Inventory,   minNivel: 3 },
    { routeName: "Tiendas",      routePath: "/dashboard/tiendas",     routeIcon: Store,       minNivel: 4 },
    { routeName: "Trabajadores", routePath: "/dashboard/trabajadores",routeIcon: People,      minNivel: 4 },
];

export default function SidebarNavigation() {
    const [openSidebar, setOpenSidebar] = useState(true);
    const pathname = usePathname();
    const { dataSession } = useSession();

    const nivelPermiso = dataSession?.nivel_permiso ?? 0;

    const visibleRoutes = NAV_ITEMS.filter(item => nivelPermiso >= item.minNivel);

    return (
        <div className={`${openSidebar ? 'w-48' : 'w-20'} bg-azulClaro h-screen flex flex-col justify-between relative z-50 duration-300`}>
            {
                openSidebar ?
                <KeyboardDoubleArrowLeftIcon
                    onClick={() => setOpenSidebar(false)}
                    className='absolute bg-white text-azulOscuro text-3xl rounded-full top-9 border border-azulOscuro -right-3 cursor-pointer z-50'
                /> :
                <KeyboardDoubleArrowRightIcon
                    className='absolute bg-white text-azulOscuro text-3xl rounded-full top-9 border border-azulOscuro -right-3 cursor-pointer z-50'
                    onClick={() => setOpenSidebar(true)}
                />
            }
            <div className='mt-12'>
                <ul className='block mt-6'>
                    {
                        visibleRoutes.map((item, idx) => {
                            const Icon = item.routeIcon;
                            const isActive = pathname === item.routePath;
                            return (
                                <Link key={idx} href={item.routePath}>
                                    <li className={`${isActive && 'bg-azulOscuro'} list-none text-white cursor-pointer p-4 hover:bg-azulOscuro w-full flex flex-row items-center ${!openSidebar && 'justify-center'}`}>
                                        <Icon />
                                        {openSidebar && <p className='ml-2'>{item.routeName}</p>}
                                    </li>
                                </Link>
                            );
                        })
                    }
                </ul>
            </div>

            <div></div>
        </div>
    );
}
