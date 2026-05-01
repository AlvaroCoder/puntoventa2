import { SideBarNavigation, TopBarNavigation } from '@/components/Navigation'
import React from 'react'

export default function Layout({children}) {
  return (
    <div className='w-full h-screen flex flex-row overflow-hidden'>
        <SideBarNavigation/>
        <div className='flex-1 flex flex-col min-w-0 bg-[#F8FAFC]'>
            <TopBarNavigation/>
            <main className='flex-1 overflow-y-auto p-8'>
                {children}
            </main>
        </div>
    </div>
  )
}
