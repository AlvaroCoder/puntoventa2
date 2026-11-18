import ContainerLayout from '@/shared/components/ContainerLayout'
import { Workflow } from 'lucide-react'
import React from 'react'

export default function TrabajadoresLayout({children}) {
  return (
      <ContainerLayout
          icon={Workflow}
          title={"Personal"}
          links={[]}
      >
          {children}
    </ContainerLayout>
  )
}