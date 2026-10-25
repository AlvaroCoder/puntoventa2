import React from 'react'

export default function Toggle({value, onChange}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="w-10 h-5 rounded-full relative transition-colors"
        style={{ background: value ? "#3960A9" : "rgba(31,47,87,0.2)" }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-150"
          style={{ left: value ? "22px" : "2px" }}
        />
      </button>
      <span
        className="text-sm"
        style={{ color: value ? "#3960A9" : "rgba(31,47,87,0.5)" }}
      >
        {value ? "Activa" : "Inactiva"}
      </span>
    </div>
  );
}