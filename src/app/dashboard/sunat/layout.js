import ContainerLayout from '@/shared/components/ContainerLayout'
import { Report } from '@mui/icons-material'
import React from 'react'

export default function SunatLayout({children}) {
  return (
      <ContainerLayout
          icon={Report} 
          title={"SUNAT"}
          links={[
            {href: "/dashboard/sunat", label: "Resumen Rapido" },
            {href: "/dashboard/configuracion", label : "Configuracion"}
          ]}
      >
          {children}
    </ContainerLayout>
  )
};