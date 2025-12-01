import React, { useState } from 'react'
import { Button } from '../ui/button';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { getDataSunatClienteDni } from '@/conexion/sunat';
import { useToast } from '@/hooks/use-toast';
import SearchIcon from '@mui/icons-material/Search';
import { Loader2 } from 'lucide-react';
import { CREATE_CLIENT } from '@/conexion/apiconexion';

export default function ButtonDropdownAddClient({
  handleAddClient
}) {
  const {toast} = useToast();
  const initialData = {
    nombre_cliente : "",
    apellido_cliente : "",
    dni_cliente : "",
    telefono_cliente :"",
    deuda_actual : 0,
    fecha_ultimo_pago : (new Date()).toISOString().split('T')[0],
    isactive: 0,
    puntuacion : 1
  }
  const [dataNewClient, setDataNewClient] = useState(initialData);
  const [loadingDataSunat, setLoadingDataSunat] = useState(false);
  const [loadingDataSave, setloadingDataSave] = useState(false);

  const handleChange=(evt)=>{
    const target = evt.target;
    setDataNewClient({
      ...dataNewClient,
      [target.name] : target.value
    })
  };
  const handleClickSunat=async(evt)=>{
    evt.preventDefault();
    if (dataNewClient.dni_cliente === "") {
      alert("Complete el campo de dni");
      return;
    }
    setLoadingDataSunat(true);
    const response = await getDataSunatClienteDni(dataNewClient.dni_cliente);
    
    if (!response.ok) {
      const responseJSON = await response.json();
      console.log(responseJSON);
      
      setLoadingDataSunat(false);
      toast({
        variant:"destructive",
        title:"Error de respuesta",
        description :responseJSON?.message
      });
      return
    }
    const responseJSON = await response.json();
    setLoadingDataSunat(false);
    setDataNewClient({
      ...dataNewClient,
      nombre_cliente : responseJSON?.nombre,
      apellido_cliente : responseJSON?.apellido,
      dni_cliente : responseJSON?.dni
    });

  }
  const handleClick=async(evt)=>{
    evt.preventDefault();
    const { nombre_cliente, apellido_cliente, dni_cliente } = dataNewClient;
    if (nombre_cliente === ""|| apellido_cliente==='' || dni_cliente === "" ) {
      toast({
        variant : "destructive",
        title:"Error",
        description : "Complete los campos vacios"
      });
      return
    }
    setloadingDataSave(true);
    const response = await CREATE_CLIENT(dataNewClient);
    if (!response.ok) {
      const responseJSON = await response.json();
      setloadingDataSave(false);
      toast({
        variant : "destructive",
        title : "Error de creacion",
        description :responseJSON?.message
      });
      return;
    }
    const responseJSON = await response.json();
    setloadingDataSave(false);

    toast({
      title : "Exito en la creacion",
      description : responseJSON?.message
    })
    
    handleAddClient(dataNewClient);

  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="mx-2 flex flex-row items-center  hover:text-white text-white bg-azulOscuro hover:bg-azulClaro"
        >
          <AddIcon/>
          <p>Agregar Cliente</p>
        </Button>

      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogDescription>Ventana para crear a un nuevo cliente</DialogDescription>
        <section className='w-full text-azulOscuro'>
            <h1 className='font-bold'>DNI </h1>
            <div className='flex flex-row items-center'>
              <Input
                type="number"
                name="dni_cliente"
                value={dataNewClient.dni_cliente}
                onChange={handleChange}
              />
              {
                loadingDataSunat ?
                <Button
                  disabled={true}
                  variant="ghost"
                  className="mx-2 bg-rojoEncendido text-white hover:bg-rojoPasion hover:text-white"
                >
                  <Loader2 className="animate-spin" />
                </Button> : 
                <Button
                onClick={handleClickSunat}
                variant="ghost"
                className="mx-2 bg-rojoEncendido text-white hover:bg-rojoPasion hover:text-white"
              >
                <p>Sunat</p>
                <SearchIcon/>
              </Button>
              }
            </div>
          
          <div className='flex flex-row mt-4'>
            <div className='flex-1'>
            <h1 className='font-bold'>Nombre <span className='text-rojoEncendido'>*</span></h1>
            <Input
              name="nombre_cliente"
              value={dataNewClient.nombre_cliente}
              onChange={handleChange}
              required
            />
            </div>
            <div className='flex-1 ml-2'>
            <h1 className='font-bold'>Apellido <span className='text-rojoEncendido'>*</span></h1>
            <Input
              name="apellido_cliente"
              value={dataNewClient.apellido_cliente}
              onChange={handleChange}
              required
            />
            </div>
          </div>

          <h1 className='font-bold mt-4'>Telefono</h1>
          <Input
            name="telefono_cliente"
            value={dataNewClient.telefono_cliente}
            onChange={handleChange}
            required
          />
          <div className='mt-4 flex flex-row items-center'>
          <div className='flex-1'>
            <h1 className='font-bold' >Deuda actual</h1>
                <Input
                  type="number"
                  placeholder="S/.00.00"
                  name="deuda_actual"
                  value={dataNewClient.deuda_actual}
                  onChange={handleChange}
                  required
                />
          </div>
          <div className='ml-2'>
            <h1 className='font-bold'>Fecha Ultimo Pago</h1>
              <Input
                type="date"
                name="fecha_ultimo_pago"
                value={dataNewClient.fecha_ultimo_pago}
                onChange={handleChange}
                required
              />
          </div>
          </div>
          <DialogFooter className={" "}>
            <DialogClose
              asChild
            >
                <Button
                  onClick={handleClick}
                  disabled={loadingDataSave}
                  className="mt-4 h-full w-full font-bold  py-4 text-white "
                >
                  {loadingDataSave ? <Loader2 className='animate-spin'/> : <h1>Agregar cliente</h1>}
                </Button>
            </DialogClose>
          </DialogFooter>
        </section>
      </DialogContent>
    </Dialog>
  )
}
