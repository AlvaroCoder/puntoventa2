import ContainerLayout from '@/shared/components/ContainerLayout'
import { Workflow } from 'lucide-react'
import React from 'react'

export default function TrabajadoresLayout({children}) {
  return (
    <ContainerLayout
      hrefPrincipal='/dashboard/trabajadores'
          icon={Workflow}
          title={"Personal"}
      links={[
            {href : "/dashboard/trabajadores/roles", label :"Roles y Permisos"}
          ]}
      >
          {children}
    </ContainerLayout>
  )
}