'use client';
import { useState, useEffect } from 'react';
import { inventarioService } from '../service/inventario.service';

export default function useProductoDetalle(id, tiendaId) {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([inventarioService.getProductoById(id, tiendaId)])
      .then(([prodct]) => {
        setProducto(prodct)
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id, tiendaId]);

  return { producto, loading, error };
}
