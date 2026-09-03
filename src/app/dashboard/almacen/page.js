'use client'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import SecondButton from '@/components/Buttons/SecondButton'
import { Title } from '@/components/Titles/Title'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
    const router = useRouter();

  return (
      <div className='w-full p-8'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
              <div>
                  <Title>Almacen</Title>
                  <p className='text-sm text-gray-400'>Administra tus almacenes</p>
                  
              </div>
              <div className='flex flex-row gap-4'>
                <SecondButton>
                    Registrar una salida
                      </SecondButton>
                  <PrimaryButton
                    handleClick={()=>router.push("/dashboard/almacen/crear")}
                  >
                      Nuevo Almacén
                    </PrimaryButton>
                </div>
          </div>
    </div>
  )
};