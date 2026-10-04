import { getClientesByEmpresa } from '@/Connections/clientes';
import { useAuth } from '@/Context/AuthContext';
import { Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import SwitcherLoader from '../Navigation/SwitcherLoader';

export default function PosPanelClients({
    setShowClienteModal = () => { },
    setCliente=()=>{}
}) {
    const { user } = useAuth();
    const [clientdata, setClientdata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clienteSearch, setClienteSearch] = useState('');
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await getClientesByEmpresa(user?.empresa_id);
                
                setClientdata(response?.data?.data ?? []);
            } catch (err) {
                
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user]);

    const filteredClient = useMemo(() => 
        (clientdata ?? []).filter(c =>
            (c?.nombre_completo ?? '').toUpperCase().includes(clienteSearch.toUpperCase()) ||
            (c?.numero_documento ?? '').includes(clienteSearch)
        ), [clientdata, clienteSearch])
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={() => setShowClienteModal(false)}
    >
      <div
        className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold" style={{ color: "#1F2F57" }}>
            Seleccionar cliente
          </h2>
          <button
            onClick={() => setShowClienteModal(false)}
            className="opacity-40 hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(31,47,87,0.35)" }}
          />
          <input
            autoFocus
            value={clienteSearch}
            onChange={(e) => setClienteSearch(e.target.value)}
            placeholder="Buscar por nombre o DNI..."
            className="w-full h-10 pl-9 pr-3 rounded-xl text-xs outline-none"
            style={{
              border: "1px solid rgba(31,47,87,0.18)",
              color: "#1F2F57",
            }}
          />
        </div>

        <SwitcherLoader loading={loading}>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {filteredClient.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCliente(c);
                  setShowClienteModal(false);
                  setClienteSearch("");
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-gray-50"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: "#3960A9" }}
                >
                  {c.nombre_completo.slice(0, 1)}
                </div>
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "#1F2F57" }}
                  >
                    {c.nombre_completo}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "rgba(31,47,87,0.45)" }}
                  >
                    {c.documento}
                  </p>
                </div>
              </button>
            ))}
            {filteredClient.length === 0 && (
              <p
                className="text-xs text-center py-4"
                style={{ color: "rgba(31,47,87,0.35)" }}
              >
                Sin resultados
              </p>
            )}
          </div>
        </SwitcherLoader>
      </div>
    </div>
  );
};