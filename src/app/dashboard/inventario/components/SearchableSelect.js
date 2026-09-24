'use client'
import { Check, ChevronDown, Search, X } from 'lucide-react';
import React, {useState, useEffect, useRef} from 'react'

export default function SearchableSelect({ value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapRef = useRef(null);

    const filtered = options.filter(
        o => o.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const selected = options.find(o => o.id == value) ?? null;

    useEffect(() => {
        const handler = e => {
            if (wrapRef.current && !wrapRef.current.contains(e.target))
                setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, []);

    const handleOpen = () => { setOpen(v => !v); setSearch('') }
    const handlePick = opt  => { onChange(opt.id); setOpen(false) }
    const handleClear = e => { e.stopPropagation(); onChange(null) }
    
return (
  <div ref={wrapRef} className="relative">
    <button
      type="button"
      onClick={handleOpen}
      className="flex items-center justify-between gap-2 h-11 px-3.5 rounded-lg w-full text-left text-[15px] transition-all"
      style={{
        border: `1px solid ${open ? "#3960A9" : "rgba(31,47,87,0.18)"}`,
        color: selected ? "#1F2F57" : "rgba(31,47,87,0.38)",
        background: "#fff",
        boxShadow: open ? "0 0 0 3px rgba(57,96,169,0.1)" : "none",
      }}
    >
      <span className="truncate text-sm">
        {selected ? selected.nombre : "Sin categoría padre"}
      </span>
      <div className="flex items-center gap-1.5 shrink-0">
        {value && (
          <span
            onClick={handleClear}
            className="cursor-pointer hover:opacity-60 transition-opacity"
          >
            <X size={13} color="rgba(31,47,87,0.4)" />
          </span>
        )}
        <ChevronDown
          size={15}
          color="rgba(31,47,87,0.4)"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s ease",
          }}
        />
      </div>
    </button>

    {open && (
      <div
        className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl overflow-hidden"
        style={{
          border: "0.5px solid rgba(31,47,87,0.14)",
          boxShadow: "0 12px 40px rgba(31,47,87,0.14)",
        }}
      >
        <div
          className="flex items-center gap-2 px-3.5 py-2.5"
          style={{ borderBottom: "0.5px solid rgba(31,47,87,0.08)" }}
        >
          <Search size={13} color="rgba(31,47,87,0.38)" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar categoría padre..."
            className="flex-1 text-xs outline-none bg-transparent placeholder:text-[rgba(31,47,87,0.35)]"
            style={{ color: "#1F2F57" }}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={12} color="rgba(31,47,87,0.35)" />
            </button>
          )}
        </div>

        <div className="max-h-56 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p
              className="px-4 py-5 text-xs text-center"
              style={{ color: "rgba(31,47,87,0.4)" }}
            >
              Sin resultados para &quot;{search}&quot;
            </p>
          ) : (
            filtered.map((opt) => {
              const isActive = value === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handlePick(opt)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-[rgba(31,47,87,0.04)]"
                  style={{
                    background: isActive
                      ? "rgba(57,96,169,0.06)"
                      : "transparent",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: isActive ? "#3960A9" : "transparent",
                      border: `1.5px solid ${isActive ? "#3960A9" : "rgba(31,47,87,0.2)"}`,
                    }}
                  >
                    {isActive && (
                      <Check size={9} color="white" strokeWidth={3} />
                    )}
                  </div>
                  <span
                    className="text-sm truncate"
                    style={{ color: "#1F2F57" }}
                  >
                    {opt.nombre}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    )}
  </div>
);
}
