import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function InputPassword({ valuesData, handleChange, placeholder = "Contraseña" }) {
  const [visibilityPassword, setVisibilityPassword] = useState(false);

  const handleClickChangeVisibility = () => {
    setVisibilityPassword(!visibilityPassword);
  };

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
        <Lock 
          className="text-[#1F4363] mr-3 transition-colors group-focus-within:text-[#FF821E]" 
          size={20} 
        />

        <input
          type={visibilityPassword ? 'text' : 'password'}
          className="
            w-full 
            bg-transparent 
            outline-none 
            text-[#333333] 
            placeholder-gray-400 
            text-sm font-medium
          "
          value={valuesData}
          name="password"
          onChange={handleChange}
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={handleClickChangeVisibility}
          className="
            ml-2 
            text-gray-400 
            hover:text-[#1F4363] 
            focus:outline-none 
            transition-colors
            cursor-pointer
            p-1
            rounded-full
            hover:bg-gray-100
          "
        >
          {visibilityPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>
    </div>
  );
}