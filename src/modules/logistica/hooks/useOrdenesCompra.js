'use client';
import { useState, useEffect } from 'react';
import { logisticaService } from '../service/logistica.service';

export default function useOrdenesCompra() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      logisticaService.getOrdenesByEmpresa(),
    ])
    .then(([ordenesData]) => {
      setOrdenes(ordenesData);
    })
    .catch(setError)
    .finally(() => setLoading(false));

  }, []);

  return { ordenes, loading, error, setOrdenes };
}
