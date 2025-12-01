import React from "react";

export default function InputField({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-[#333333] ml-1">{label}</label>
      <div className="group flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 transition-all hover:border-[#1F4363]/50 focus-within:border-[#FF821E] focus-within:ring-4 focus-within:ring-[#FF821E]/10 shadow-sm">
        <Icon
          className="text-[#1F4363] mr-3 transition-colors group-focus-within:text-[#FF821E]"
          size={20}
        />
        <input
          className="w-full bg-transparent outline-none text-[#333333] placeholder-gray-400 text-sm font-medium"
          {...props}
        />
      </div>
    </div>
  );
}
