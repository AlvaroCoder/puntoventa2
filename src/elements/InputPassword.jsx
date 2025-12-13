import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function InputPassword({ label, value, onChange, name, placeholder, error}) {
  const [isVisible, setIsVisible] = useState(false);
  
return (
    <div className="space-y-1.5 text-left">
      <div className="flex justify-between items-center ml-1">
        <label className="text-sm font-bold text-[#333333]">{label}</label>
        {error && (
          <span className="text-xs text-red-500 font-medium flex items-center gap-1 animate-in slide-in-from-right-2">
            <AlertCircle size={12} /> {error}
          </span>
        )}
      </div>
      <div className={`
        group flex items-center bg-white border rounded-xl px-4 py-2 transition-all shadow-sm
        ${error 
          ? 'border-red-500 ring-2 ring-red-500/10' 
          : 'border-gray-200 hover:border-[#1F4363]/50 focus-within:border-[#FF821E] focus-within:ring-4 focus-within:ring-[#FF821E]/10'
        }
      `}>
        <Lock 
          className={`mr-3 transition-colors ${error ? 'text-red-500' : 'text-[#1F4363] group-focus-within:text-[#FF821E]'}`} 
          size={20} 
        />
        <input
          type={isVisible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none text-[#333333] placeholder-gray-400 text-sm font-medium ${error ? 'placeholder-red-300' : ''}`}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="ml-2 text-gray-400 hover:text-[#1F4363] focus:outline-none transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}