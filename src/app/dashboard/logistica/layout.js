import ContainerLayout from '@/shared/components/ContainerLayout'
import { Truck } from 'lucide-react'
import React from 'react'

export default function LogisticaLayout({children}) {
  return (
      <ContainerLayout
          icon={Truck}
          title={"Logística"}
          links={[
              { href: "/dashboard/logistica/ordenes-compra", label: "Ordenes de Compra" },
              { href: '/dashboard/logistica/proveedores', label: "Proveedores" },
              { href: "/dashboard/logistica/entradas", label: "Entradas" },
              {href : "/dashboard/logistica/reportes", label : "Reportes"}
          ]}
      >
          {children}
      </ContainerLayout>
  )
}
