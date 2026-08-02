import React from 'react'

export default function SectionTitle({children}) {
  return (
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 pb-1.5 border-b border-gray-100">
            {children}
        </h3>
  )
};