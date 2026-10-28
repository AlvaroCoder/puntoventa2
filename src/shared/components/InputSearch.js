import { Search } from 'lucide-react';
import React from 'react'

export default function InputSearch({
    setQuery,
    setPage,
    query
}) {
  return (
    <div
      className="flex-1 flex items-center gap-2 px-3 rounded-lg h-9 min-w-[220px]"
      style={{
        background: "#fff",
        border: "0.5px solid rgba(31,47,87,0.18)",
      }}
    >
      <Search size={14} color="rgba(31,47,87,0.4)" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
        placeholder="Nombre, codigo o escanear..."
        className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
        style={{ color: "#1F2F57" }}
      />
    </div>
  );
};