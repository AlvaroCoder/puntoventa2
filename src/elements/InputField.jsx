import { AlertCircle, Check, Loader2 } from "lucide-react";
import React from "react";

export default function InputField({ label, icon: Icon, error=false, loading=false, obligatory=false, checkValue=false, ...props }) {
  return (
    <div className="space-y-1.5 text-left">
      <div className="flex justify-between items-center ml-1">
        <label className="text-sm font-bold text-[#333333] ">
          {label}{" "}
          {obligatory && <span className="text-red-500 font-bold ">(*)</span>}
        </label>
        {error && (
          <span className="text-xs text-red-500 font-medium flex items-center gap-1 animate-in slide-in-from-right-2">
            <AlertCircle size={12} /> {error}
          </span>
        )}
      </div>
      <div
        className={`
      group flex items-center bg-white border rounded-lg px-4 py-3 transition-all shadow-sm
     "border-gray-200 hover:border-[#1F4363]/50 focus-within:border-azulMarino focus-within:ring-4 focus-within:ring-[#FF821E]/10"
    `}
      >
        <Icon
          className={`mr-3 transition-colors ${error ? "text-red-500" : "text-azulMarino group-focus-within:text-verdeAgua"}`}
          size={20}
        />
        <input
          className={`w-full bg-transparent outline-none text-[#333333] placeholder-gray-400 text-sm font-medium ${error ? "placeholder-red-300" : ""}`}
          {...props}
        />
        {loading && <Loader2 className="w-8 h-8 animate-spin " />}
        {checkValue && <Check className="text-green-400" />}
      </div>
    </div>
  );
}
