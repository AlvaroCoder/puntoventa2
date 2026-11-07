'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useProductoDetalle from '@/modules/inventary/hooks/useProductoDetalle';
import PageProductoDetalle from '@/modules/inventary/PageProductoDetalle';

export default function Page() {
  const { id } = useParams();
  const { tiendaId } = useSearchParams();
  const router = useRouter();

  const { producto, loading, error } = useProductoDetalle(id, tiendaId);

  const [alertaMinimo, setAlertaMinimo] = useState(2);
  const [visibleEnCaja, setVisibleEnCaja] = useState(true);

  useEffect(() => {
    if (!producto) return;
    setAlertaMinimo(producto.alertaMinimo ?? 2);
    setVisibleEnCaja(producto.visibleEnCaja ?? true);
  }, [producto]);

  function handleReponer() {
    router.push(`/dashboard/inventario/productos/${id}/reponer`);
  }

  function handleEditar() {
    router.push(`/dashboard/inventario/productos/${id}/editar`);
  }

  if (error) {
    return (
      <div className="p-6 bg-[#E1E7F0] min-h-full flex items-center justify-center">
        <p className="text-sm" style={{ color: '#DC2626' }}>
          No se pudo cargar el producto. Intenta nuevamente.
        </p>
      </div>
    );
  }

  return (
    <PageProductoDetalle
      producto={producto}
      loading={loading}
      alertaMinimo={alertaMinimo}
      setAlertaMinimo={setAlertaMinimo}
      visibleEnCaja={visibleEnCaja}
      setVisibleEnCaja={setVisibleEnCaja}
      handleReponer={handleReponer}
      handleEditar={handleEditar}
    />
  );
}
