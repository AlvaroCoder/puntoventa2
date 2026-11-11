'use client';
import { useState, useEffect } from 'react';
import { inventarioService } from "@/modules/inventary/service/inventario.service";
import { useLoading } from '@/Context/LoadingContext';
export default function useTienda() {
  const {withLoading} = useLoading();
    const [tiendas, setTiendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        withLoading(Promise.all([inventarioService.getTiendas()]))
          .then(([tiends]) => {
            setTiendas(tiends);
          })
          .catch(setError)
          .finally(() => setLoading(false));
    }, []);

    return {tiendas, loading, error, setTiendas };
}