import React from 'react'

export default function Layout({children}) {
  return (
    <div className='w-full h-screen flex flex-row overflow-hidden'>
        <div className='flex-1 flex flex-col min-w-0 bg-[#F8FAFC]'>
            <main className='flex-1 overflow-y-auto '>
                {children}
            </main>
        </div>
    </div>
  )
}
