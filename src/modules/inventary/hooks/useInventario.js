'use client'
import React, {useState, useEffect} from 'react'
import {inventarioService} from '@/modules/inventary/service/inventario.service'
export default function useInventario() {
      const [categorias, setCategorias] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
    useEffect(() => {
      inventarioService
        .getCategorias()
        .then(setCategorias)
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { categorias, loading, error };
}
