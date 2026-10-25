'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useOrdenesCompra from '@/modules/logistica/hooks/useOrdenesCompra';
import PageLogistica from '@/modules/logistica/PageLogistica';

export default function Page() {
  const { ordenes, loading, error, setOrdenes } = useOrdenesCompra();
  console.log("error from useOrdenesCompra:", error);
  const [activeTab, setActiveTab] = useState('ordenes');
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState('Todas');

  const router = useRouter();

  const conteos = useMemo(() => {
    const base = { total: ordenes.length };
    ordenes.forEach(o => {
      base[o.estado] = (base[o.estado] ?? 0) + 1;
    });
    return base;
  }, [ordenes]);

  const ordenesFiltradas = useMemo(() => {
    let resultado = ordenes;

    if (filtro !== 'Todas') {
      resultado = resultado.filter(o => o.estado === filtro);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      resultado = resultado.filter(
        o =>
          o.numero.toLowerCase().includes(q) ||
          o.proveedor.toLowerCase().includes(q)
      );
    }

    return resultado;
  }, [ordenes, filtro, query]);

  const handleAccion = useCallback((id, tipo) => {
    switch (tipo) {
      case 'recibir':
        router.push(`/dashboard/logistica/ordenes-compra/${id}/recibir`);
        break;
      case 'completar':
        router.push(`/dashboard/logistica/ordenes-compra/${id}/recibir`);
        break;
      case 'continuar':
        router.push(`/dashboard/logistica/ordenes-compra/${id}/editar`);
        break;
      case 'ver':
        router.push(`/dashboard/logistica/ordenes-compra/${id}`);
        break;
      default:
        toast.info(`Acción "${tipo}" no implementada`);
    }
  }, [router]);

  if (error) {
    toast.error('Error al cargar las órdenes de compra');
  }

  return (
    <PageLogistica
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      query={query}
      setQuery={setQuery}
      filtro={filtro}
      setFiltro={setFiltro}
      ordenesFiltradas={ordenesFiltradas}
      conteos={conteos}
      loading={loading}
      handleAccion={handleAccion}
    />
  );
}
