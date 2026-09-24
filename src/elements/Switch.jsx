import React from 'react'

export default function Switch({ on, toggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-[#1EB3B2]" : "bg-[#1F2F57]/25"}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-1" : "-translate-x-5"}`}
      />
    </button>
  );
}