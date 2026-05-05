import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Download, Loader2, Upload } from 'lucide-react';

export default function ImportExcelModal({open, onClose}) {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleDrop = e => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped && (dropped.name.endsWith('.xlsx')) || dropped?.name?.endsWith('.xls')) {
            setFile(dropped);
        } else {
            toast.warn('Solo se aceptan archivo .xlsx o .xls')
        }
    }

    const handleUpload = async () => {
        if (!file) { toast.warn('Selecciona un archivo primero '); return; }
        setUploading(true);
        await new Promise(r => setTimeout(r, 1500));
        setUploading(false);
        toast.success('Clientes importados correctamente');
        setFile(null);
        onClose();
    }

  return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-[#1F4363] font-bold text-lg">Importar Clientes</DialogTitle>
                    <DialogDescription className="text-sm text-gray-400 mt-0.5">
                        Sube un archivo Excel con los datos de tus clientes
                    </DialogDescription>
                </div>

                <div className="px-6 py-5 flex flex-col gap-4">
                    {/* Descargar plantilla */}
                    <div className="flex items-center justify-between bg-[#1F4363]/5 rounded-xl px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-[#1F4363]">Plantilla de ejemplo</p>
                            <p className="text-xs text-gray-400">Descarga y completa con tus datos</p>
                        </div>
                        <a href="/assets/plantilla_importar_clientes.xlsx" download>
                            <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-[#1F4363] text-[#1F4363] hover:bg-[#1F4363] hover:text-white">
                                <Download size={14} />
                                Descargar
                            </Button>
                        </a>
                    </div>

                    {/* Drop zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('excel-input').click()}
                        className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-colors ${
                            dragging
                                ? 'border-[#FF821E] bg-[#FF821E]/5'
                                : file
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-200 hover:border-[#FF821E]/50 hover:bg-gray-50'
                        }`}
                    >
                        <input
                            id="excel-input"
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={e => setFile(e.target.files[0] ?? null)}
                        />
                        <Upload size={28} className={`mx-auto mb-2 ${file ? 'text-green-500' : 'text-gray-300'}`} />
                        {file ? (
                            <>
                                <p className="text-sm font-semibold text-green-600">{file.name}</p>
                                <p className="text-xs text-gray-400 mt-1">Archivo listo para importar</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-gray-500">Arrastra tu archivo aquí</p>
                                <p className="text-xs text-gray-400 mt-1">o haz clic para seleccionar (.xlsx, .xls)</p>
                            </>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1 border-gray-200 text-gray-500">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="flex-1 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                        >
                            {uploading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
                            Importar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
  )
};
