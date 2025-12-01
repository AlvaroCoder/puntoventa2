import { cn } from '@/lib/utils'
import React from 'react'

export default function Title1({className="",children}) {
  return (
    <h1 className={cn(className,'font-bold text-4xl')}>
        {children}
    </h1>
  )
};
