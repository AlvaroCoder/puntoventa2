'use client';
import Link from 'next/link'
import React from 'react'

export default function LinkButtonCard({ title, subtitle, href, Icon, bg, hover }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <Link href={href}>
      <div
        className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-150 cursor-pointer"
        style={{ backgroundColor: hovered ? "#F5F7FA" : "transparent" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-150"
          style={{
            backgroundColor: hovered ? hover : bg,
            transform: hovered ? "translateY(-3px)" : "translateY(0)",
            boxShadow: hovered
              ? `0 8px 20px ${bg}45`
              : "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <Icon style={{ fontSize: 30, color: "#FFFFFF" }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#1F4363] leading-tight">
            {title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 leading-tight">
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
};