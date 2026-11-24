import {
    createCodigoUnion,
    getCodigosUnion,
    desactivarCodigoUnion,
} from '@/Connections/codigos-union'

export const trabajadorService = {
    async getTrabajadores() {
        const response = await fetch('/api/almacenes', { method: 'GET' });
        if (!response.ok) throw new Error("Error al obtener las tiendas");
        const data = await response.json();
        return data;
    },

    // ── Códigos de unión ─────────────────────────────────────────────────────
    async crearCodigoInvitacion({ rol_id, tienda_id, vigencia_horas = 24 }) {
        return createCodigoUnion({ rol_id, tienda_id, vigencia_horas })
    },

    async getCodigosVigentes() {
        const res = await getCodigosUnion('vigente')
        return Array.isArray(res.data) ? res.data : []
    },

    async desactivarCodigo(id) {
        return desactivarCodigoUnion(id)
    },
}
