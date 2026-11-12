'use client'
import React, {useState, useEffect} from 'react'
import { inventarioService } from '@/modules/inventary/service/inventario.service';
import { useLoading } from '@/Context/LoadingContext';
export default function useInventario(tiendaId = 1) {
  const {withLoading} = useLoading();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productosByTienda, setProductosByTienda] = useState([]);

  useEffect(() => {
    withLoading(
      Promise.all([
        inventarioService.getProductos(),
        inventarioService.getCategorias(),
        inventarioService.getProductosByTienda(tiendaId)
      ]),
    )
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [tiendaId]); 

  return { categorias, productos, productosByTienda, loading, error };
}
