'use client'
import { useCallback, useRef } from 'react'

/**
 * Hook para generar códigos de producto a partir del nombre.
 * Lógica: toma las 3 primeras letras en mayúscula de cada palabra, separadas por guion,
 * más un correlativo de 3 dígitos basado en un contador interno de sesión.
 *
 * Ej: "Zapatilla Nike Air" → "ZAP-NIK-AIR-001"
 * Ej: "Polo" → "POL-001"
 */
export function useGenerarCodigo() {
    const counterRef = useRef(1)

    const generarCodigo = useCallback((nombre = '') => {
        if (!nombre.trim()) return ''

        const palabras = nombre
            .trim()
            .split(/\s+/)
            .filter(Boolean)

        const partes = palabras
            .map(p => p.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '').toUpperCase().slice(0, 3))
            .filter(p => p.length > 0)

        const correlativo = String(counterRef.current).padStart(3, '0')
        counterRef.current += 1

        return [...partes, correlativo].join('-')
    }, [])

    const resetContador = useCallback((valor = 1) => {
        counterRef.current = valor
    }, [])

    return { generarCodigo, resetContador }
}
