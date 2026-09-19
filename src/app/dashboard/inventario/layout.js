'use client'

import React from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import DropdownConfiguracion from './components/DropdownConfiguracion'
import { Title } from '@/components/Titles/Title'
import Text from '@/components/Titles/Text'

function WrapperLink({ href, children }) { 
  return (
    <div className="px-4 py-2 hover:bg-gray-100 rounded-md">
      <Link href={href}>
        <Text>{children}</Text>
      </Link>
    </div>
  )
}

export default function InventarioLayout({ children }) {
  return (
      <div className="flex flex-col min-h-screen bg-[#E1E7F0]">
        <div
          className="bg-white flex items-center gap-8 px-6"
          style={{
            height: 52,
            borderBottom: '0.5px solid rgba(31,47,87,0.1)',
            flexShrink: 0,
          }}
        >
          <div className="flex items-center gap-2">
            <Package size={18} color="#3960A9" />
            <Title>Inventario</Title>
          </div>
       
          <div className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[200px]">
            <WrapperLink href="/dashboard/inventario">Resumen General</WrapperLink>
            <WrapperLink href="/dashboard/inventario/productos">Productos</WrapperLink>  
          <WrapperLink href="/dashboard/inventario/reportes">Reportes</WrapperLink>
            <DropdownConfiguracion />
          </div>
        </div>

        <div className="flex-1">
          {children}
        </div>
      </div>
  )
}