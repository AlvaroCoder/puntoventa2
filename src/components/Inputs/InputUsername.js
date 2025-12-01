import React from 'react';
import { User } from 'lucide-react';

export default function InputUsername({ valuesData, handleChange, placeholder = "Usuario" }) { 
  return (
    <div className="w-full">
      <div 
        className="
          group 
          flex flex-row items-center 
          bg-white 
          border border-gray-200 
          rounded-xl 
          px-4 py-3 
          transition-all duration-200 ease-in-out
          hover:border-[#1F4363]/50
          focus-within:border-[#FF821E] 
          focus-within:ring-4 focus-within:ring-[#FF821E]/10
          shadow-sm
        "
      >
        <User
          className="text-[#1F4363] mr-3 transition-colors group-focus-within:text-[#FF821E]"
          size={20}
        />

        <input
            className="
              w-full 
              bg-transparent 
              outline-none 
              text-[#333333] 
              placeholder-gray-400 
              text-sm font-medium
            "
            value={valuesData}
            name="username"
            onChange={handleChange}
            placeholder={placeholder}
            type="text"
            autoComplete="username"
        />
      </div>
    </div>
  );
}