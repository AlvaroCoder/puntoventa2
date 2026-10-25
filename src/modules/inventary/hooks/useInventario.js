'use client'
import React, {useState, useEffect} from 'react'
import {inventarioService} from '@/modules/inventary/service/inventario.service'
export default function useInventario() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      inventarioService.getProductos(),
      inventarioService.getCategorias(),
    ])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []); 

  return { categorias, productos, loading, error };
}
