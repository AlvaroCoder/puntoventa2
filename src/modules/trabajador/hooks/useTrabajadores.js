'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/Context/AuthContext';
import { getTrabajadoresByEmpresa } from '@/Connections/trabajadores';

const AVATAR_COLORS = ['#1F2F57', '#198E7B', '#3960A9', '#E8A020', '#9B59B6', '#C0392B'];

function getInitials(nombre) {
  if (!nombre) return '??';
  const parts = nombre.trim().split(' ');
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? parts[0]?.[1] ?? '')).toUpperCase();
}

function normalizar(raw, idx) {
  return {
    id:          raw.id,
    nombre:      raw.nombre_completo ?? raw.nombre ?? '—',
    iniciales:   getInitials(raw.nombre_completo ?? raw.nombre ?? ''),
    email:       raw.email ?? '—',
    telefono:    raw.telefono ?? null,
    rol:         raw.rol?.nombre ?? raw.rol ?? '—',
    rol_id:      raw.rol?.id ?? raw.rol_id ?? null,
    tienda:      raw.tienda?.nombre ?? raw.tienda ?? 'Sin tienda',
    activo:      raw.activo ?? true,
    ultimoAcceso:raw.ultimo_acceso ?? null,
    cajaAsignada:raw.caja_asignada ?? null,
    cajaEstado:  raw.caja_estado ?? null,
    colorAvatar: AVATAR_COLORS[idx % AVATAR_COLORS.length],
  };
}

export default function useTrabajadores() {
  const { user } = useAuth();
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.empresa_id) return;
    setLoading(true);
    getTrabajadoresByEmpresa(user.empresa_id)
      .then(res => {
        if (!res.error) {
          const raw = res.data?.data ?? res.data ?? [];
          setTrabajadores((Array.isArray(raw) ? raw : []).map(normalizar));
        } else {
          setError(res.message);
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [user?.empresa_id]);

  return { trabajadores, loading, error, setTrabajadores };
}
