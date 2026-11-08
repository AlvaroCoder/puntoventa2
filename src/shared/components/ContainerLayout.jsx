import React from 'react'
import { Title } from './Title';
import WrapperLink from '@/components/Navigation/WrapperLink';
import Link from 'next/link';

export default function ContainerLayout({
  icon : Icon,
  title,
  links = [],
  actions,
  children,
  hrefPrincipal="/dashboard"
}) {
  const IconLayout = Icon
  return (
    <div className="flex flex-col min-h-screen bg-grisClaro">
      <div
        className="bg-white flex items-center gap-8 px-6"
        style={{
          height: 52,
          borderBottom: "0.5px solid rgba(31,47,87,0.1)",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-2">
          <Link
            href={hrefPrincipal}
            className="flex items-center gap-2 px-3 rounded-lg py-2 min-w-[200px] hover:bg-grisClaro transition-colors"
          >
            {Icon && <IconLayout size={18} color="#3960A9" />}
            <Title>{title}</Title>
          </Link>
        </div>
        <div className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[200px]">
          {links.map(({ href, label }) => (
            <WrapperLink key={href} href={href}>
              {label}
            </WrapperLink>
          ))}
          {actions}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}