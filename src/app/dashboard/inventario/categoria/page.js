'use client'
import React, { useState, useMemo, useEffect } from 'react'
import PageInventary from '@/modules/inventary/PageInventary';
import useInventario from '@/modules/inventary/hooks/useInventario';

export default function Page() {
   const { categorias, loading } = useInventario();

   const [selected, setSelected] = useState(new Set());
   const [query, setQuery] = useState("");

   const filtered = useMemo(
     () =>
       categorias.filter((c) =>
         c.nombre.toLowerCase().includes(query.toLowerCase()),
       ),
     [categorias, query],
   );

   const allSelected = selected.size === filtered.length && filtered.length > 0;
   const someSelected = selected.size > 0 && !allSelected;

   const toggleAll = () =>
     allSelected
       ? setSelected(new Set())
       : setSelected(new Set(filtered.map((c) => c.id)));

   const toggleOne = (id) => {
     const next = new Set(selected);
     next.has(id) ? next.delete(id) : next.add(id);
     setSelected(next);
   };


    return (
      <PageInventary
        categorias={filtered}
        query={query}
        setQuery={setQuery}
        filtered={filtered}
        loading={loading}
        selected={selected}
        toggleOne={toggleOne}
        toggleAll={toggleAll}
        allSelected={allSelected}
        someSelected={someSelected}
        setSelected={setSelected}
      />
    );
}