import ContainerLayout from '@/shared/components/ContainerLayout'
import { Workflow } from 'lucide-react'
import React from 'react'

export default function TrabajadoresLayout({children}) {
  return (
      <ContainerLayout
          icon={Workflow}
          title={"Trabajadores"}
          links={[
              { href: "/dashboard/trabajadores", label: "Resumen General" },
              {href : "/dashboard/configuracion", label : "Configuración"}
          ]}
      >
          {children}
    </ContainerLayout>
  )
}