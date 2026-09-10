'use client'
//import { Switch } from '@/components/ui/switch'
import TablaVariantes from './TablaVariantes'

/**
 * SeccionVariantes — toggle + tabla de variantes.
 * Props:
 *   tieneVariantes: boolean
 *   onToggle: (val: boolean) => void
 *   variantes: array
 *   onVariantesChange: (variantes) => void
 *   mostrarStock: boolean
 */
export default function SeccionVariantes({
    tieneVariantes,
    onToggle,
    variantes,
    onVariantesChange,
    mostrarStock = false,
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                    <p className="text-sm font-semibold text-[#1F4363]">Variantes de talla o color</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Activa si el producto tiene diferentes tallas, colores u otras variantes
                    </p>
                </div>
                {/* <Switch
                    checked={tieneVariantes}
                    onCheckedChange={onToggle}
                    className="data-[state=checked]:bg-[#FF821E]"
                /> */}
            </div>

            {tieneVariantes && (
                <div className="space-y-2">
                    <p className="text-xs text-gray-500">
                        Ingresa cada variante con su talla, color y stock. El stock se asignará a la tienda seleccionada en la sección de stock inicial.
                    </p>
                    <TablaVariantes
                        variantes={variantes}
                        onChange={onVariantesChange}
                        mostrarStock={mostrarStock}
                    />
                </div>
            )}
        </div>
    )
}
