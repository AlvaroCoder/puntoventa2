import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function CreateLinkButton({href, children}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
      style={{ background: "#1F2F57" }}
    >
      <Plus size={14} />
      {children}
    </Link>
  );
}