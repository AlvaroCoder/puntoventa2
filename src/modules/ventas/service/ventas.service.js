export const ventasService = {
    async getMovimientosByCaja(cajaId) {
        const response = await fetch('/api/caja/movimientos?cajaId=' + cajaId, {
           method : 'GET'
        });
        if (!response.ok) throw new Error("Error al obtener movimientos");
        return response.json();
    },
    async getVentas() {
        const response = await fetch('/api/venta', { method: 'GET' });
        if (!response.ok) throw new Error("Error al obtener ventas");
        const raw = await response.json();
        return raw?.data?.content || [];
    },
    async createVenta(body) {
        const response = await fetch('/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const raw = await response.json();
        return { ok: response.ok, error: !response.ok, data: raw?.data ?? raw, message: raw?.message ?? '' };
    }
}