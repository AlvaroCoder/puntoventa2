import React from 'react'

export default function Button({ children, variant = "primary", className = "", icon: Icon }) {
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg";
  
  const variants = {
    primary: "bg-[#FF821E] text-white hover:bg-[#e5700f] shadow-orange-500/20",
    secondary: "bg-[#1F4363] text-white hover:bg-[#16324a] shadow-blue-900/20",
    outline: "border-2 border-[#1F4363] text-[#1F4363] hover:bg-[#1F4363] hover:text-white shadow-none hover:shadow-lg",
    ghost: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
};