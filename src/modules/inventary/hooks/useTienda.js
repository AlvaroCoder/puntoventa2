'use client';
import { useState, useEffect } from 'react';
import { inventarioService } from "@/modules/inventary/service/inventario.service";

export default function useTienda() {
    const [tiendas, setTiendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([inventarioService.getTiendas()])
          .then(([tiends]) => {
            setTiendas(tiends);
          })
          .catch(setError)
          .finally(() => setLoading(false));
    }, []);

    return {tiendas, loading, error, setTiendas };
}