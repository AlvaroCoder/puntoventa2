'use client'
import { Suspense } from 'react'
import PagePayment from '@/modules/ventas/PagePayment'

export default function Page() {
  return (
    <Suspense>
      <PagePayment />
    </Suspense>
  )
}
