'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ButtonLinkSimple({ href, children}) {
    const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="hover:underline transition-colors hover:text-[#1F2F57]"
    >
      {children}
    </button>
  );
}