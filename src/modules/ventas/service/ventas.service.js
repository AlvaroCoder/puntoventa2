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
    }
}