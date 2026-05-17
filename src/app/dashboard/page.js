'use client'
import { WelcomeCard } from '@/components/Cards'
import { useAuth } from '@/Context/AuthContext'
import React from 'react'

export default function Page() {
  const { user } = useAuth();
  console.log(user);
  
  return (
    <div className='flex-1 w-full p-8'>
     <WelcomeCard/>
      
    </div>
  )
}
    