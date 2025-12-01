import React from 'react'

export default function Title1({children, className=""}) {
  return (
     <h1 className={`text-4xl md:text-6xl font-extrabold text-[#333333] tracking-tight leading-tight ${className}`}>
    {children}
  </h1>
  )
}
