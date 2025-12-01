'use client'
import React, { useMemo, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ButtonDialogAddClient } from '../Buttons'

import { TableClientsData } from './elements'

export default function TableClientes({
  data=[],
  handleClientSelected=()=>{}
}) {
  
  const [dataClients, setDataClients] = useState(data);
  const [queryInput, setQueryInput] = useState("");

  const handleAddClient=(dataClient={})=>{
    setDataClients([...dataClients, dataClient]);
  };

  const handleChangeQueryInput=(e)=>{
    setQueryInput(e.target.value);
  }

  const currentData = useMemo(() => {
    return dataClients?.filter((item)=>item?.nombre_cliente?.toUpperCase().includes(queryInput.toUpperCase()) ||
    item?.apellido_cliente?.toUpperCase().includes(queryInput.toUpperCase()));
  },[queryInput, dataClients])
  return (
    <section className='w-full'>
      <div className='flex items-center py-4'> 
        <Input
          placeholder="Buscar cliente ..."
          onChange={handleChangeQueryInput}
        />
        <ButtonDialogAddClient
          handleAddClient={handleAddClient}
        />  
        <Button
          variant="ghost"
        >
          Descargar Excel
        </Button>
      </div>
      <TableClientsData
        data={currentData}
        handleClientSelected={handleClientSelected}
      />
    </section>
  )
}
