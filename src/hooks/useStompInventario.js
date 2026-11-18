'use client'
import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'

const SPRING_WS = process.env.NEXT_PUBLIC_SPRING_WS_URL ?? 'http://localhost:8085/ws'

/**
 * Se suscribe a /topic/inventario/{tiendaId} vía STOMP+SockJS.
 * Llama a onInventarioUpdate({ productoId, varianteId, tiendaId, nuevoStock, nombreProducto })
 * cada vez que llega un mensaje del servidor.
 *
 * Se desconecta automáticamente al desmontar el componente o al cambiar tiendaId.
 */
export function useStompInventario(tiendaId, onInventarioUpdate) {
  // Mantener la callback actualizada sin re-conectar al WebSocket
  const cbRef = useRef(onInventarioUpdate)
  useEffect(() => {
    cbRef.current = onInventarioUpdate
  })

  useEffect(() => {
    if (!tiendaId || typeof window === 'undefined') return

    let stompClient = null
    let cancelado = false

    async function connect() {
      try {
        const { default: SockJS } = await import('sockjs-client')
        if (cancelado) return

        stompClient = new Client({
          webSocketFactory: () => new SockJS(SPRING_WS),
          reconnectDelay: 5000,
          onConnect: () => {
            console.debug('[POS-WS] Conectado — tienda', tiendaId)
            stompClient.subscribe(
              `/topic/inventario/${tiendaId}`,
              (msg) => {
                try {
                  cbRef.current?.(JSON.parse(msg.body))
                } catch {
                  // ignore parse errors
                }
              },
            )
          },
          onStompError: (frame) => {
            console.warn('[POS-WS] Error STOMP:', frame.headers?.message)
          },
          onDisconnect: () => {
            console.debug('[POS-WS] Desconectado')
          },
        })

        stompClient.activate()
      } catch (err) {
        console.warn('[POS-WS] Error al conectar:', err)
      }
    }

    connect()

    return () => {
      cancelado = true
      stompClient?.deactivate()
    }
  }, [tiendaId])
}