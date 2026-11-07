"use client";

import React from "react";

export default function Switch({
  on,
  toggle,
  disabled = false,
  label,
  className = "",
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={Boolean(on)}
      aria-label={label || "Activar o desactivar"}
      disabled={disabled}
      onClick={() => toggle?.(!on)}
      className={`
        group relative inline-flex
        h-7 w-12 shrink-0
        items-center
        rounded-full
        cursor-pointer
        outline-none
        transition-all duration-200
        focus-visible:ring-[3px]
        focus-visible:ring-[#1EB3B2]/20
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${className}
      `}
    >
      {/* Línea de fondo */}
      <span
        aria-hidden="true"
        className={`
          absolute inset-x-1
          top-1/2 h-[5px]
          -translate-y-1/2
          rounded-full
          transition-colors duration-300 ease-out
          ${on ? "bg-[#1EB3B2]" : "bg-[#CBD5E1]"}
        `}
      />

      {/* Círculo deslizante */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute left-0.5
          flex h-6 w-6
          items-center justify-center
          rounded-full
          border-[1.5px]
          bg-slate-300
          shadow-[0_1px_4px_rgba(15,23,42,0.15)]
          transition-all duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            on
              ? "translate-x-5 border-[#1EB3B2]"
              : "translate-x-0 border-[#CBD5E1]"
          }
          group-hover:shadow-[0_2px_7px_rgba(15,23,42,0.18)]
        `}
      />
    </button>
  );
}
