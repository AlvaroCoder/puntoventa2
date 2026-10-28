'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ImageIcon, Search, ChevronDown, X, ArrowLeft, Check } from 'lucide-react';

// ─── Catálogo mock ────────────────────────────────────────────────────────────
const CATALOGO = [
  { id: 1,  nombre: 'Zapatilla urbana',      categoria: 'Zapatillas', tallas: '37-42', precioRef: 159.90 },
  { id: 2,  nombre: 'Zapatilla running',      categoria: 'Zapatillas', tallas: '37-43', precioRef: 199.00 },
  { id: 3,  nombre: 'Zapatilla de lona',      categoria: 'Zapatillas', tallas: '35-42', precioRef: 79.90  },
  { id: 4,  nombre: 'Zapatilla niño velcro',  categoria: 'Zapatillas', tallas: '27-34', precioRef: 99.90  },
  { id: 5,  nombre: 'Zapato escolar negro',   categoria: 'Escolar',    tallas: '30-40', precioRef: 119.90 },
  { id: 6,  nombre: 'Zapato escolar niña',    categoria: 'Escolar',    tallas: '28-36', precioRef: 109.90 },
  { id: 7,  nombre: 'Sandalia de cuero',      categoria: 'Sandalias',  tallas: '35-40', precioRef: 89.90  },
  { id: 8,  nombre: 'Sandalia playera',       categoria: 'Sandalias',  tallas: '35-42', precioRef: 49.90  },
  { id: 9,  nombre: 'Botín casual',           categoria: 'Botines',    tallas: '38-42', precioRef: 199.00 },
  { id: 10, nombre: 'Medias deportivas x3',   categoria: 'Accesorios', tallas: 'única', precioRef: 19.90  },
  { id: 11, nombre: 'Pasadores de colores',   categoria: 'Accesorios', tallas: 'única', precioRef: 5.00   },
  { id: 12, nombre: 'Betún y cepillo',        categoria: 'Accesorios', tallas: 'única', precioRef: 12.90  },
];

const TIPOS_NEGOCIO = ['Zapatería', 'Ropa y moda', 'Ferretería', 'Abarrotes', 'Farmacia'];
const ALMACENES     = ['Almacen Stack (A-866)', 'Lima Central', 'Miraflores'];

// ─── Tarjeta de producto ──────────────────────────────────────────────────────
function ProductCard({ producto, seleccionado, onToggle }) {
  return (
    <button
      onClick={() => onToggle(producto)}
      className="bg-white rounded-xl text-left transition-all hover:shadow-md focus:outline-none"
      style={{
        border: seleccionado ? '2px solid #1F2F57' : '0.5px solid rgba(31,47,87,0.12)',
      }}
    >
      {/* Imagen + checkbox */}
      <div className="relative">
        <div
          className="w-full h-28 rounded-t-xl flex items-center justify-center"
          style={{ background: 'rgba(31,47,87,0.04)' }}
        >
          <ImageIcon size={28} strokeWidth={1.5} style={{ color: 'rgba(31,47,87,0.2)' }} />
        </div>
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center transition-all"
          style={{
            background: seleccionado ? '#1F2F57' : '#fff',
            border:     seleccionado ? 'none'    : '1.5px solid rgba(31,47,87,0.25)',
          }}
        >
          {seleccionado && <Check size={11} color="#fff" strokeWidth={2.5} />}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 pt-2.5">
        <p className="text-xs font-semibold leading-tight" style={{ color: '#1F2F57' }}>
          {producto.nombre}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(31,47,87,0.5)' }}>
          {producto.categoria} · {producto.tallas}
        </p>
        <p className="text-[10px] mt-1.5 font-medium" style={{ color: 'rgba(31,47,87,0.55)' }}>
          Ref. S/ {producto.precioRef.toFixed(2)}
        </p>
      </div>
    </button>
  );
}

// ─── Panel de selección ───────────────────────────────────────────────────────
function PanelSeleccion({ seleccionArray, almacen, setAlmacen, onQuitarTodo, onRemover, onPrecio, onCantidad }) {
  const count = seleccionArray.length;
  return (
    <div
      className="bg-white rounded-xl p-4 sticky top-4"
      style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold" style={{ color: '#1F2F57' }}>
          Tu selección ({count})
        </span>
        {count > 0 && (
          <button
            onClick={onQuitarTodo}
            className="text-[11px] font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#3960A9' }}
          >
            Quitar todo
          </button>
        )}
      </div>

      {/* Almacén */}
      <p className="text-[11px] font-medium mb-1.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
        ¿A qué almacén entra el stock inicial?
      </p>
      <div className="relative mb-4">
        <select
          value={almacen}
          onChange={(e) => setAlmacen(e.target.value)}
          className="w-full h-8 pl-3 pr-7 rounded-lg text-xs appearance-none outline-none"
          style={{ background: '#F8FAFC', border: '0.5px solid rgba(31,47,87,0.18)', color: '#1F2F57' }}
        >
          {ALMACENES.map((a) => <option key={a}>{a}</option>)}
        </select>
        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(31,47,87,0.4)' }} />
      </div>

      {count === 0 ? (
        <p className="text-xs text-center py-8" style={{ color: 'rgba(31,47,87,0.3)' }}>
          Selecciona productos del catálogo
        </p>
      ) : (
        <>
          {/* Encabezados columnas */}
          <div className="grid grid-cols-[1fr_64px_36px_16px] gap-1.5 mb-2">
            {['Producto', 'Tu precio', 'Cant.', ''].map((h) => (
              <span key={h} className="text-[10px] font-semibold" style={{ color: 'rgba(31,47,87,0.4)' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Lista */}
          <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto">
            {seleccionArray.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_64px_36px_16px] gap-1.5 items-center">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold leading-tight truncate" style={{ color: '#1F2F57' }}>
                    {item.nombre}
                  </p>
                  <p className="text-[10px]" style={{ color: 'rgba(31,47,87,0.4)' }}>
                    {item.categoria} · {item.tallas}
                  </p>
                </div>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={item.precio}
                  onChange={(e) => onPrecio(item.id, e.target.value)}
                  className="w-full h-7 px-1.5 rounded text-[11px] text-right outline-none"
                  style={{ border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                />
                <input
                  type="number"
                  min={0}
                  value={item.cantidad}
                  onChange={(e) => onCantidad(item.id, e.target.value)}
                  className="w-full h-7 px-1 rounded text-[11px] text-center outline-none"
                  style={{ border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
                />
                <button onClick={() => onRemover(item.id)} className="flex items-center justify-center hover:opacity-60 transition-opacity">
                  <X size={13} style={{ color: 'rgba(31,47,87,0.4)' }} />
                </button>
              </div>
            ))}
          </div>

          {/* Nota */}
          <p className="text-[10px] mt-4 leading-relaxed" style={{ color: 'rgba(31,47,87,0.4)' }}>
            Puedes dejar la cantidad en 0 y sumar stock después. Costos, colores y fotos se completan en el detalle de cada producto.
          </p>
        </>
      )}
    </div>
  );
}

export default function PageSemilla() {
  const router = useRouter();

  const [tipoNegocio,      setTipoNegocio]      = useState('Zapatería');
  const [categoriaActiva,  setCategoriaActiva]  = useState('Todos');
  const [busqueda,         setBusqueda]         = useState('');
  const [almacen,          setAlmacen]          = useState(ALMACENES[0]);
  // seleccion: { [id]: { precio, cantidad } }
  const [seleccion,        setSeleccion]        = useState({});

  // Tabs de categoría con conteos
  const tabs = useMemo(() => {
    const map = {};
    CATALOGO.forEach((p) => { map[p.categoria] = (map[p.categoria] || 0) + 1; });
    return [
      { key: 'Todos', count: CATALOGO.length },
      ...Object.entries(map).map(([k, v]) => ({ key: k, count: v })),
    ];
  }, []);

  // Productos filtrados
  const filtrados = useMemo(() => {
    let list = CATALOGO;
    if (categoriaActiva !== 'Todos') list = list.filter((p) => p.categoria === categoriaActiva);
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      list = list.filter((p) => p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q));
    }
    return list;
  }, [categoriaActiva, busqueda]);

  // Array de seleccionados para el panel
  const seleccionArray = useMemo(
    () => Object.entries(seleccion).map(([id, data]) => ({
      ...CATALOGO.find((p) => p.id === Number(id)),
      ...data,
    })),
    [seleccion],
  );

  const count = seleccionArray.length;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleSeleccion = (producto) => {
    setSeleccion((prev) => {
      const next = { ...prev };
      if (next[producto.id]) { delete next[producto.id]; }
      else { next[producto.id] = { precio: producto.precioRef, cantidad: 2 }; }
      return next;
    });
  };

  const onPrecio = (id, val) =>
    setSeleccion((prev) => ({ ...prev, [id]: { ...prev[id], precio: Number(val) } }));

  const onCantidad = (id, val) =>
    setSeleccion((prev) => ({ ...prev, [id]: { ...prev[id], cantidad: Number(val) } }));

  const onRemover = (id) =>
    setSeleccion((prev) => { const n = { ...prev }; delete n[id]; return n; });

  const handleCrear = () => {
    console.log('Crear:', seleccionArray, 'en almacén:', almacen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#E1E7F0]">
      <div className="flex-1 p-6 pb-24">

        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#1F2F57' }}>Catálogo sugerido</h1>
            <p className="text-xs mt-1 max-w-xl" style={{ color: 'rgba(31,47,87,0.55)' }}>
              Marca los productos que vendes. Ya traen categoría, tallas típicas y un precio de referencia que puedes cambiar.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs" style={{ color: 'rgba(31,47,87,0.5)' }}>Tipo de negocio</span>
            <div className="relative">
              <select
                value={tipoNegocio}
                onChange={(e) => setTipoNegocio(e.target.value)}
                className="h-8 pl-3 pr-7 rounded-lg text-xs font-medium appearance-none outline-none"
                style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
              >
                {TIPOS_NEGOCIO.map((t) => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(31,47,87,0.4)' }} />
            </div>
          </div>
        </div>

        {/* ── Layout dos columnas ──────────────────────────────────────────── */}
        <div className="flex gap-5 items-start">

          {/* Izquierda: catálogo */}
          <div className="flex-1 min-w-0">

            {/* Tabs + buscador */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {tabs.map((tab) => {
                const active = categoriaActiva === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setCategoriaActiva(tab.key)}
                    className="h-8 px-3.5 rounded-full text-xs font-semibold transition-all"
                    style={
                      active
                        ? { background: '#1F2F57', color: '#fff' }
                        : { background: '#fff', color: 'rgba(31,47,87,0.6)', border: '0.5px solid rgba(31,47,87,0.18)' }
                    }
                  >
                    {tab.key} · {tab.count}
                  </button>
                );
              })}

              {/* Buscador */}
              <div className="relative ml-auto">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(31,47,87,0.35)' }} />
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar en el catálogo"
                  className="h-8 pl-8 pr-3 rounded-full text-xs outline-none"
                  style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.18)', color: '#1F2F57', minWidth: 190 }}
                />
              </div>
            </div>

            {/* Grid de productos */}
            {filtrados.length === 0 ? (
              <p className="text-sm text-center py-16" style={{ color: 'rgba(31,47,87,0.35)' }}>
                Sin resultados para {busqueda}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtrados.map((p) => (
                  <ProductCard
                    key={p.id}
                    producto={p}
                    seleccionado={!!seleccion[p.id]}
                    onToggle={toggleSeleccion}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Derecha: panel selección */}
          <div className="w-72 shrink-0">
            <PanelSeleccion
              seleccionArray={seleccionArray}
              almacen={almacen}
              setAlmacen={setAlmacen}
              onQuitarTodo={() => setSeleccion({})}
              onRemover={onRemover}
              onPrecio={onPrecio}
              onCantidad={onCantidad}
            />
          </div>
        </div>
      </div>

      {/* ── Barra inferior fija ───────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3 z-20"
        style={{ background: '#fff', borderTop: '0.5px solid rgba(31,47,87,0.1)' }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-medium transition-opacity hover:opacity-70"
          style={{ border: '0.5px solid rgba(31,47,87,0.2)', color: '#1F2F57' }}
        >
          <ArrowLeft size={14} />
          Volver
        </button>

        <button
          onClick={handleCrear}
          disabled={count === 0}
          className="h-9 px-5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-30"
          style={{ background: '#1F2F57' }}
        >
          Crear {count > 0 ? count : ''} producto{count !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}
