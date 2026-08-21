import { TopBarNavigation } from '@/components/Navigation'
import React from 'react'

export default function RootLayoutBd({ children }) {
    return (
        <div className='w-full h-screen flex flex-row overflow-hidden'>
            <div className='flex-1 flex flex-col min-w-0 bg-[#F8FAFC]'>
                <TopBarNavigation />
                <main className='flex-1 overflow-y-auto p-4'>
                    {children}
                </main>
            </div>
        </div>
    )
}