'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { getSession } from '@/lib/authentication'
import {
    GET_TRABAJADORES_BY_EMPRESA,
    GET_CUOTA_TRABAJADORES,
    CREATE_TRABAJADOR,
    UPDATE_TRABAJADOR,
    TOGGLE_ESTADO_TRABAJADOR,
    GET_TIENDAS_BY_EMPRESA,
    GET_ROLES
} from '@/conexion/apiconexion'
import { toast } from 'react-toastify'

const EMPTY_FORM = {
    nombre_completo: '', email: '', password: '', tipo_documento: 'DNI',
    numero_documento: '', telefono: '', tienda_id: '', rol_id: '',
    salario_base: 1025, fecha_contratacion: ''
};

export default function Page() {
    const [session, setSession] = useState(null);
    const [trabajadores, setTrabajadores] = useState([]);
    const [cuota, setCuota] = useState(null);
    const [tiendas, setTiendas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    const canWrite = session?.esAdmin || (session?.nivel_permiso ?? 0) >= 4;

    const cargarDatos = useCallback(async (empresaId, token) => {
        try {
            const [resTrab, resCuota] = await Promise.all([
                GET_TRABAJADORES_BY_EMPRESA(empresaId),
                GET_CUOTA_TRABAJADORES(empresaId)
            ]);
            const jsonTrab = await resTrab.json();
            const jsonCuota = await resCuota.json();
            setTrabajadores(jsonTrab?.data?.data ?? []);
            setCuota(jsonCuota?.data ?? null);
        } catch {
            toast('Error al cargar trabajadores', { type: 'error', autoClose: 3000 });
        }
    }, []);

    useEffect(() => {
        async function init() {
            try {
                const s = await getSession();
                setSession(s);
                if (!s?.empresa_id) return;
                await cargarDatos(s.empresa_id, s.access_token);
                const [resTiendas, resRoles] = await Promise.all([
                    GET_TIENDAS_BY_EMPRESA(s.empresa_id),
                    GET_ROLES()
                ]);
                const jTiendas = await resTiendas.json();
                const jRoles = await resRoles.json();
                setTiendas(jTiendas?.data ?? []);
                setRoles(jRoles?.data ?? []);
            } catch {
                toast('Error al inicializar', { type: 'error', autoClose: 3000 });
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [cargarDatos]);

    const abrirCrear = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const abrirEditar = (t) => {
        setEditTarget(t);
        setForm({
            nombre_completo: t.nombre_completo ?? '',
            email: t.email ?? '',
            password: '',
            tipo_documento: t.tipo_documento ?? 'DNI',
            numero_documento: t.numero_documento ?? '',
            telefono: t.telefono ?? '',
            tienda_id: t.tienda_id ?? '',
            rol_id: t.rol_id ?? '',
            salario_base: t.salario_base ?? 1025,
            fecha_contratacion: t.fecha_contratacion?.slice(0, 10) ?? ''
        });
        setShowModal(true);
    };

    const handleGuardar = async () => {
        setSaving(true);
        try {
            let res;
            if (editTarget) {
                const { password, email, ...datos } = form;
                res = await UPDATE_TRABAJADOR(editTarget.id, datos);
            } else {
                res = await CREATE_TRABAJADOR({ ...form, empresa_id: session.empresa_id });
            }
            const json = await res.json();
            if (!res.ok) {
                toast(json?.message ?? 'Error al guardar', { type: 'error', autoClose: 4000 });
                return;
            }
            toast(editTarget ? 'Trabajador actualizado' : 'Trabajador creado', { type: 'success', autoClose: 3000 });
            setShowModal(false);
            await cargarDatos(session.empresa_id, session.access_token);
        } catch {
            toast('Error de conexión', { type: 'error', autoClose: 3000 });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleEstado = async (t) => {
        try {
            const res = await TOGGLE_ESTADO_TRABAJADOR(t.id, !t.activo);
            if (!res.ok) { toast('Error al cambiar estado', { type: 'error', autoClose: 3000 }); return; }
            toast(!t.activo ? 'Trabajador activado' : 'Trabajador desactivado', { type: 'success', autoClose: 3000 });
            await cargarDatos(session.empresa_id, session.access_token);
        } catch {
            toast('Error de conexión', { type: 'error', autoClose: 3000 });
        }
    };

    const trabajadoresFiltrados = trabajadores.filter(t =>
        t.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.numero_documento?.includes(busqueda)
    );

    if (loading) return <div className='w-full py-4 px-8'><p className='text-gray-400'>Cargando...</p></div>;

    return (
        <div className='w-full py-4 px-8 overflow-x-auto'>
            {/* Header */}
            <div className='flex items-start justify-between mb-4'>
                <div>
                    <h1 className='font-bold text-azulOscuro text-2xl'>Trabajadores</h1>
                    <p className='text-sm text-gray-400'>Gestión del personal de tu empresa</p>
                </div>
                <div className='flex items-center gap-3'>
                    {cuota && (
                        <div className={`text-sm px-3 py-1 rounded-full font-medium ${cuota.cuota_llena ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {cuota.total}/{cuota.limite} empleados · {cuota.plan}
                        </div>
                    )}
                    {canWrite && (
                        <button
                            onClick={abrirCrear}
                            disabled={cuota?.cuota_llena}
                            className='bg-azulOscuro text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            + Nuevo trabajador
                        </button>
                    )}
                </div>
            </div>

            {/* Buscador */}
            <input
                type='text'
                placeholder='Buscar por nombre, email o documento...'
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className='w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-4 outline-none focus:border-azulOscuro'
            />

            {/* Tabla */}
            <div className='overflow-x-auto rounded-lg border border-gray-200'>
                <table className='w-full text-sm'>
                    <thead className='bg-azulOscuro text-white'>
                        <tr>
                            <th className='text-left px-4 py-3'>Nombre</th>
                            <th className='text-left px-4 py-3'>Email</th>
                            <th className='text-left px-4 py-3'>Documento</th>
                            <th className='text-left px-4 py-3'>Rol</th>
                            <th className='text-center px-4 py-3'>Estado</th>
                            {canWrite && <th className='text-center px-4 py-3'>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {trabajadoresFiltrados.length === 0 ? (
                            <tr><td colSpan={canWrite ? 6 : 5} className='text-center py-8 text-gray-400'>Sin trabajadores registrados</td></tr>
                        ) : (
                            trabajadoresFiltrados.map((t) => (
                                <tr key={t.id} className='border-t border-gray-100 hover:bg-gray-50'>
                                    <td className='px-4 py-3 font-medium'>{t.nombre_completo}</td>
                                    <td className='px-4 py-3 text-gray-500'>{t.email}</td>
                                    <td className='px-4 py-3 text-gray-500'>{t.tipo_documento} · {t.numero_documento}</td>
                                    <td className='px-4 py-3'>
                                        <span className='bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium'>
                                            {t.rol?.nombre ?? '-'}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 text-center'>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {t.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    {canWrite && (
                                        <td className='px-4 py-3 text-center'>
                                            <div className='flex gap-2 justify-center'>
                                                <button onClick={() => abrirEditar(t)} className='text-xs text-blue-600 hover:underline'>Editar</button>
                                                <button onClick={() => handleToggleEstado(t)} className={`text-xs ${t.activo ? 'text-red-500' : 'text-green-600'} hover:underline`}>
                                                    {t.activo ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto'>
                        <h2 className='font-bold text-azulOscuro text-lg mb-4'>
                            {editTarget ? 'Editar trabajador' : 'Nuevo trabajador'}
                        </h2>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='col-span-2'>
                                <label className='text-xs text-gray-500 mb-1 block'>Nombre completo *</label>
                                <input value={form.nombre_completo} onChange={e => setForm(f => ({ ...f, nombre_completo: e.target.value }))}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro' />
                            </div>
                            {!editTarget && <>
                                <div className='col-span-2'>
                                    <label className='text-xs text-gray-500 mb-1 block'>Email *</label>
                                    <input type='email' value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro' />
                                </div>
                                <div className='col-span-2'>
                                    <label className='text-xs text-gray-500 mb-1 block'>Contraseña *</label>
                                    <input type='password' value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro' />
                                </div>
                            </>}
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Tipo documento</label>
                                <select value={form.tipo_documento} onChange={e => setForm(f => ({ ...f, tipo_documento: e.target.value }))}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro'>
                                    <option value='DNI'>DNI</option>
                                    <option value='CE'>CE</option>
                                    <option value='PASAPORTE'>Pasaporte</option>
                                </select>
                            </div>
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Número documento *</label>
                                <input value={form.numero_documento} onChange={e => setForm(f => ({ ...f, numero_documento: e.target.value }))}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro' />
                            </div>
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Teléfono</label>
                                <input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro' />
                            </div>
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Salario base</label>
                                <input type='number' value={form.salario_base} onChange={e => setForm(f => ({ ...f, salario_base: e.target.value }))}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro' />
                            </div>
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Tienda *</label>
                                <select value={form.tienda_id} onChange={e => setForm(f => ({ ...f, tienda_id: e.target.value }))}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro'>
                                    <option value=''>Seleccionar...</option>
                                    {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Rol *</label>
                                <select value={form.rol_id} onChange={e => setForm(f => ({ ...f, rol_id: e.target.value }))}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro'>
                                    <option value=''>Seleccionar...</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                                </select>
                            </div>
                            <div className='col-span-2'>
                                <label className='text-xs text-gray-500 mb-1 block'>Fecha contratación</label>
                                <input type='date' value={form.fecha_contratacion} onChange={e => setForm(f => ({ ...f, fecha_contratacion: e.target.value }))}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azulOscuro' />
                            </div>
                        </div>
                        <div className='flex gap-3 mt-5 justify-end'>
                            <button onClick={() => setShowModal(false)} className='px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50'>
                                Cancelar
                            </button>
                            <button onClick={handleGuardar} disabled={saving} className='px-4 py-2 text-sm bg-azulOscuro text-white rounded-lg hover:opacity-90 disabled:opacity-50'>
                                {saving ? 'Guardando...' : (editTarget ? 'Actualizar' : 'Crear trabajador')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
