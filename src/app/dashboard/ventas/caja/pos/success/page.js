'use client'
import { Suspense } from 'react'
import PageSuccess from '@/modules/ventas/PageSuccess'

export default function Page() {
  return (
    <Suspense>
      <PageSuccess />
    </Suspense>
  )
}
