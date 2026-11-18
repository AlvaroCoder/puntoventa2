'use client'
import { Suspense } from 'react'
import PageEditarTrabajador from '@/modules/trabajador/PageEditarTrabajador'

export default function Page() {
  return (
    <Suspense>
      <PageEditarTrabajador />
    </Suspense>
  )
}
