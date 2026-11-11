import React from 'react'
import TopBarNavigationDashbord from '@/components/Navigation/TopBarNavigationDashbord';
import { LoadingProvider } from "@/Context/LoadingContext";

export default function Layout({children}) {
  return (
    <LoadingProvider>
       <div className='w-full h-screen flex flex-row overflow-hidden'>
        <div className='flex-1 flex flex-col min-w-0 bg-[#F8FAFC]'>
              <TopBarNavigationDashbord/>
              <main className='flex-1 overflow-y-auto '>
                  {children}
              </main>
          </div>
      </div>
    </LoadingProvider>
  )
}
