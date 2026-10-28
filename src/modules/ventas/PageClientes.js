'use client'
import { Title } from '@/shared/components/Title';
import { Import, Loader2, Plus, Search } from 'lucide-react';
import React from 'react'
import EmptyState from './components/EmptyState';
import ClientCard from './components/ClientCard';
import SliderFormEditClient from './components/SliderFormEditClient';
import ImportExcelClient from './components/ImportExcelClient';
import AppButton from '@/shared/components/AppButton';
import SliderClientData from './components/SliderClientData';
import SliderFormNewClient from './components/SliderFormNewClient';

export default function PageClientes({
  loading,
  dataClient,
  queryInput,
  setQueryInput,
  setShowImport,
  router,
  setClientSelected,
  filteredData,
  handleEditFromTable,
  handleDeleteClient,
  clientSelected,
  handleEditFromPanel,
  handleUpdateClient,
  showImport,
    setShowForm,
    handleAddClient,
    showForm,
  clientToEdit
}) {
  return (
    <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Title>Clientes</Title>
          <p
            className="text-xs mt-0.5 flex items-center gap-2"
            style={{ color: "rgba(31,47,87,0.55)" }}
          >
            Gestiona la cartera de tus clientes
            {!loading && (
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(31,47,87,0.08)",
                  color: "#1F2F57",
                }}
              >
                {dataClient.length}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[250px]"
            style={{
              background: "#fff",
              border: "0.5px solid rgba(31,47,87,0.18)",
            }}
          >
            <Search size={14} color="rgba(31,47,87,0.4)" />
            <input
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Buscar por nombre o documento..."
              className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
              style={{ color: "#1F2F57" }}
            />
          </div>

          <AppButton variant="negative" handleClick={() => setShowImport(true)}>
            <Import size={14} />
            <span> Importar Excel</span>
          </AppButton>

          <AppButton
            variant="primary"
            handleClick={() => router.push("/dashboard/ventas/clientes/crear")}
          >
            <Plus size={14} />
            <span>Nuevo Cliente</span>
          </AppButton>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-56">
          <Loader2
            className="animate-spin"
            size={32}
            style={{ color: "#1F2F57" }}
          />
        </div>
      ) : filteredData.length === 0 ? (
        <EmptyState query={queryInput} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredData.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onSelect={setClientSelected}
              onEdit={handleEditFromTable}
              onDelete={handleDeleteClient}
            />
          ))}
        </div>
      )}

      <SliderClientData
        open={!!clientSelected}
        onClose={() => setClientSelected(null)}
        clientData={clientSelected}
        onEdit={handleEditFromPanel}
      />

      <SliderFormEditClient
        open={!!clientToEdit}
        onClose={() => setClientToEdit(null)}
        clientData={clientToEdit}
        onSuccess={handleUpdateClient}
      />

      <SliderFormNewClient
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleAddClient}
      />

      <ImportExcelClient
        open={showImport}
        onClose={() => setShowImport(false)}
      />
    </div>
  );
}
