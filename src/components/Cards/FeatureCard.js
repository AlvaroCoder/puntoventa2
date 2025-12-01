'use client'
import React from 'react'

export default function FeatureCard({title, icon}) {
    const Icon = icon;
  return (
    <div className='p-4 rounded-lg border border-azulOscuro text-azulOscuro flex flex-col items-center justify-center  mx-4' >
        <div className='text-6xl p-2'>
            <Icon className="w-40"/>
        </div>
        <p className='w-32 text-center font-bold'>{title}</p>
    </div>
  )
}