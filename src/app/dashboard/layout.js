import { SideBarNavigation, TopBarNavigation } from '@/components/Navigation'
import React from 'react'

export default function Layout({children}) {
  return (
    <div className='w-full min-h-screen flex flex-row '>
        <SideBarNavigation/>
        <div className='w-full min-h-screen flex flex-col overflow-y-hidden'>
            <TopBarNavigation/>
            {children}
        </div>
    </div>
  )
}
