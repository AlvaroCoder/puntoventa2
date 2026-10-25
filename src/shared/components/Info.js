import React from 'react'

export default function Info({ icon, label, value, sub }) {
  return (
    <div>
      <span
        className="text-[10px] uppercase tracking-wide"
        style={{ color: "rgba(31,47,87,0.45)" }}
      >
        {label}
      </span>
      <div className="flex min-h-11 items-center gap-3 rounded-lg bg-[#E1E7F0]/55 px-3">
        <span className="text-azulClaro [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        <div>
          <div className="text-[15px] font-bold">{value}</div>
          {sub && <div className="text-xs text-[#1F2F57]/55">{sub}</div>}
        </div>
      </div>
    </div>
  );
};