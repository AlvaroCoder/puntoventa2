'use client'
import React, { useEffect, useState } from 'react'
import { ButtonDropdownProfile, ButtonsLoading } from '../Buttons';
import { useAuth } from '@/Context/AuthContext';
import { usePathname } from 'next/navigation';

const ROUTE_LABELS = {
    '/dashboard':              'Inicio',
    '/dashboard/clientes':     'Clientes',
    '/dashboard/creditos':     'Créditos',
    '/dashboard/caja':         'Caja',
    '/dashboard/inventario':   'Inventario',
    '/dashboard/tiendas':      'Tiendas',
    '/dashboard/trabajadores': 'Trabajadores',
};

export default function TopBarNavigation() {
    const [currentTime, setCurrentTime] = useState('');
    const { loading } = useAuth();
    const pathname = usePathname();

    const pageTitle = ROUTE_LABELS[pathname] ?? 'Dashboard';

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const option = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
            setCurrentTime(now.toLocaleDateString('es-ES', option));
        };
        updateDate();
        const interval = setInterval(updateDate, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="w-full h-20 bg-white border-b border-gray-100 shadow-sm flex flex-row items-center justify-between px-8 shrink-0">
            <div>
                <h1 className="font-bold text-xl text-[#1F4363] tracking-tight">{pageTitle}</h1>
                <p className="text-sm text-[#8D99AE] capitalize">{currentTime}</p>
            </div>
            <div>
                {loading
                    ? <ButtonsLoading />
                    : <ButtonDropdownProfile />
                }
            </div>
        </nav>
    );
}