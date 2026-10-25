import React from 'react'

export default function InputMoney({ value, onChange, warning }) {
  return (
    <div
      className={`flex h-11 overflow-hidden rounded-lg border bg-white ${warning ? "border-2 border-[#E8A020]" : "border-[#1F2F57]/20"}`}
    >
      <span className="grid w-11 place-items-center bg-[#E1E7F0]/65 font-bold">
        S/
      </span>
      <input
        type="number"
        min="0"
        step="0.01"
        className="min-w-0 flex-1 px-3 outline-none"
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
