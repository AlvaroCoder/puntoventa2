import React from 'react'

export default function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-bold">
        {label}
        {hint && (
          <span
            title={hint}
            className="rounded-full bg-[#E1E7F0] px-2 py-0.5 text-xs font-normal"
          >
            ?
          </span>
        )}
      </span>
      {children}
    </label>
  );
}