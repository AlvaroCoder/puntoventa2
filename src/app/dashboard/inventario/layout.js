'use client'

import React from 'react'
import { Package } from 'lucide-react'
import DropdownConfiguracion from './components/DropdownConfiguracion'
import ContainerLayout from '@/shared/components/ContainerLayout'

export default function InventarioLayout({ children }) {
  return (
    <ContainerLayout
      icon={Package}
      title={"Inventario"}
      links={[
        { href: "/dashboard/inventario", label: "Resumen general" },
        { href: "/dashboard/inventario/productos", label: "Productos" },
        {href : "/dashboard/inventario/reportes", label : "Reportes"}
      ]}
      actions={<DropdownConfiguracion/>}
    >
      {children}
    </ContainerLayout>
  )
}