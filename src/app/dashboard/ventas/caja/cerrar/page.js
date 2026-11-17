'use client'
import { Suspense } from 'react'
import PageCerrarCaja from '@/modules/ventas/PageCerrarCaja'

export default function Page() {
  return (
    <Suspense>
      <PageCerrarCaja />
    </Suspense>
  )
}
