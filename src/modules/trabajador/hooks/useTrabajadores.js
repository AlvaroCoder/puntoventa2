'use client';
import { useState, useEffect } from 'react';

const MOCK_TRABAJADORES = [
  {
    id: 1,
    nombre: 'Alvaro Vega',
    email: 'admin@tunegocio.pe',
    iniciales: 'AV',
    rol: 'Administrador',
    tienda: 'Todas las tiendas',
    ultimoAcceso: 'Hoy, 16:30',
    cajaAsignada: null,
    cajaEstado: null,
    colorAvatar: '#1F2F57',
  },
  {
    id: 2,
    nombre: 'Rosa Castillo',
    email: 'rosa.c@tunegocio.pe',
    iniciales: 'RC',
    rol: 'Cajero',
    tienda: 'Tienda StackImportaciones',
    ultimoAcceso: null,
    cajaAsignada: 'Caja Stack Impo',
    cajaEstado: 'Abierta',
    colorAvatar: '#198E7B',
  },
  {
    id: 3,
    nombre: 'Pedro Medina',
    email: 'pedro.m@tunegocio.pe',
    iniciales: 'PM',
    rol: 'Almacenero',
    tienda: 'Almacen Stack',
    ultimoAcceso: 'Ayer, 18:05',
    cajaAsignada: null,
    cajaEstado: null,
    colorAvatar: '#E8A020',
  },
];

export default function useTrabajadores() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setTrabajadores(MOCK_TRABAJADORES);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { trabajadores, loading, error, setTrabajadores };
}
