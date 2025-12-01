'use client'
import React, { useState } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoneyOff } from '@mui/icons-material';

export default function SidebarNavigation() {
    const [loading, setLoading] = useState(true);
    const [openSidebar, setOpenSidebar] = useState(true);
    const pathname = usePathname();

    const routes=[
        {
            routeName : "Inicio",
            routePath : "/dashboard",
            routeIcon : HomeIcon,
            selected : true
        },
        {
            routeName : "Clientes",
            routePath :"/dashboard/clientes",
            routeIcon : PersonIcon,
            selected : false
        },
        {
            routeName : "Creditos",
            routePath : "/dashboard/creditos",
            routeIcon : MoneyOff,
            selected : false
        }
    ]
    const [dataRoutes, setDataRoutes] = useState(routes)
    const handleClick=(index)=>{
        const newDataRoutes = routes?.map((item, idx)=>{
            if (index === idx) {
                return {
                    ...item,
                    selected : true
                }
            }
            return{
                ...item, 
                selected : false
            }
        });
        setDataRoutes(newDataRoutes)
    }
  return (
    <div className={`${openSidebar ? 'w-48' : 'w-20'} bg-azulClaro h-screen flex flex-col justify-between relative z-50 duration-300`}>
        {
            openSidebar ?
            <KeyboardDoubleArrowLeftIcon
                onClick={()=>setOpenSidebar(false)}
                className='absolute bg-white text-azulOscuro text-3xl rounded-full top-9 border border-azulOscuro -right-3 cursor-pointer z-50'
            /> : 
            <KeyboardDoubleArrowRightIcon
                className='absolute bg-white text-azulOscuro text-3xl rounded-full top-9 border border-azulOscuro -right-3 cursor-pointer z-50'
                onClick={()=>setOpenSidebar(true)}
            />
        }
        <div className='mt-12'>
            <ul className='block mt-6'>
                {
                    dataRoutes?.map((item, idx)=>{
                        const Icon = item?.routeIcon;
                        return (
                            <Link
                                key={idx}
                                href={item?.routePath}
                            >
                                <li
                                    onClick={()=>handleClick(idx)}
                                    className={`${item?.selected && 'bg-azulOscuro'} list-none text-white cursor-pointer p-4 hover:bg-azulOscuro w-full flex flex-row items-center ${!openSidebar && 'justify-center'}`}
                                >
                                    <Icon/>
                                    {
                                        openSidebar && <p className='ml-2'>{item?.routeName}</p>
                                    }
                                </li>
                            </Link>
                        )
                    })
                }
            </ul>
        </div>
        
        <div>

        </div>
    </div>
  )
}
