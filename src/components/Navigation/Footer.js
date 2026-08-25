'use client'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) return null;
  if (pathname.startsWith('/signup')) return null;
  if (pathname.startsWith('/login')) return null;
  return (
      <footer className="bg-[#16324a] text-gray-400 py-12 border-t border-white/5">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>
            © 2025 <a href='https://www.alvacode.dev' target='_blank' rel="noopener noreferrer" className="hover:text-[#FF821E] transition-colors font-medium">alvacode</a>. Todos los derechos reservados.
          </p>
        </div>
      </footer>
  )
}
