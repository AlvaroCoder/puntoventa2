import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useMemo, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Star, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { Skeleton } from '@mui/material';

const headers=[
    {value : "Nombre"},
    {value : "Apellido"},
    {value : "Deuda Actual (S/.)"},
    {value : "Ultimo Pago"},
    {value : "Puntuacion"},
    {value : "Estado"},
    {value : <EditIcon/>}
]  

export default function TableClientsData({data=[], handleClientSelected=()=>{}}) {
    const typesClient=[
        {name : "Todos", isSelected : true, value : 2, className: "bg-gray-200"},
        {name : "Activo", isSelected : false, value : 0, className: "bg-green-100"},
        {name : "Inactivo", isSelected: false, value : 1, className: "bg-red-500"}
    ];
    const [variantTypesClient, setVariantTypesClient] = useState(typesClient);
    const [loading, setLoading] = useState(false);


    const handleChangeTypesClient=(index)=>{
        const newDataTypesClient = typesClient.map((item, idx)=>{
            if (idx === index) {
              return {
                ...item,
                isSelected : true
              }
            }
            return {
              ...item,
              isSelected : false
            }
          });
          setVariantTypesClient(newDataTypesClient)
    }
    
    const filterDataTypeClient = useMemo(()=>{
        const variantFilter =variantTypesClient.filter(i=>i.isSelected);
        if (variantFilter[0]?.value == 2) {
            return data
        }
        return data.filter(item=>item?.isactive == variantFilter[0]?.value);
    },[data, variantTypesClient]);

    const handleDeleteClient=async(id)=>{
        // Implement delete client logic here
        try {
            console.log(`Deleting client with ID: ${id}`);
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/clients', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_cliente: id }),
            });
            const responseJSON = await response.json();
            console.log(responseJSON);

        } catch (error) {
            console.error("Error deleting client:", error);
            toast.error("Error al eliminar el cliente");
            
        }finally{
            setLoading(false);
        }
    }
  return (
    <section className='w-full'>
        <div className='w-full border-gray-100 border-b-[1px] flex flex-row'>
            {
                variantTypesClient?.map((item, idx)=>
                <p  
                    key={idx}
                    onClick={()=>handleChangeTypesClient(idx)}
                    className={`p-4 border-b-[1px] cursor-pointer ${item?.isSelected ? ' border-b-azulOscuro' : 'border-b-gray-100'}`}
                >
                    {item?.name}
                </p>)
            }
        </div>
        {
            loading ?
            <section className='w-full mt-4'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <h1>Nombre</h1>
                            </TableHead>
                            <TableHead>
                                <h1>Apellido</h1>
                            </TableHead>
                            <TableHead>
                                <h1>Deuda Actual (S/.)</h1>
                            </TableHead>
                            <TableHead>
                                <h1>Ultimo Pago</h1>
                            </TableHead>
                            <TableHead>
                                <h1>Puntuacion</h1>
                            </TableHead>
                            <TableHead>
                                <h1>Estado</h1>
                            </TableHead>
                            <TableHead>
                                <h1><EditIcon/></h1>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            Array.from({length: 10}).map((_, idx)=>(
                                <TableRow key={idx}>
                                    {
                                        headers?.map((_, index)=>
                                        <TableCell key={index}>
                                            <Skeleton/>
                                        </TableCell>
                                        )
                                    }
                                </TableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </section>
            :
            <section className='w-full mt-4'>
                <Table>
                    <TableCaption>
                    <p>
                        Lista de los clientes de la tienda
                    </p>
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            {
                                headers?.map((item, idx)=>
                                    <TableHead key={idx}>
                                        <h1 className='text-azulOscuro font-bold'>{item?.value}</h1>
                                    </TableHead>
                                )
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filterDataTypeClient.length > 0 ?
                            (
                                filterDataTypeClient?.map((cliente)=>(
                                    <TableRow key={cliente?.id_cliente}>
                                        <TableCell>
                                            <p onClick={()=>handleClientSelected(cliente)} className='underline cursor-pointer'>{cliente?.nombre_cliente}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{cliente?.apellido_cliente}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>S/.{cliente?.deuda_actual}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{cliente?.fecha_ultimo_pago}</p>
                                        </TableCell>
                                        <TableCell>
                                            <ul>
                                                {Array.from({length: cliente?.puntuacion}, (_, i) => (
                                                    <li key={i} className="inline-block text-yellow-400"><Star/></li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>
                                            <p className={cn('p-2 rounded-lg text-azulOscuro text-center', typesClient?.filter((type)=>type?.value === cliente?.isactive)[0].className)}>{typesClient?.filter((type)=>type?.value === cliente?.isactive)[0]?.name}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" className="w-8 h-8">
                                                        <MoreVertIcon/>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-fit p-2" >
                                                    <div className='w-fit flex flex-col '>
                                                        <Button variant="ghost" className="w-full justify-between ">
                                                            <p>Editar</p><EditIcon/>
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            className="w-full justify-between"
                                                            onClick={()=>handleDeleteClient(cliente?.id_cliente)}    
                                                        >
                                                            <p>Eliminar</p><Trash/>
                                                        </Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                )) 
                            ) : 
                            <TableRow
                                className="text-center h-48"
                            >
                                <TableCell colSpan={7}><h1>No hay resultados</h1></TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </section>
        }
    </section>
  )
}
