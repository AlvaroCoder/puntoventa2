import Text from '@/components/Titles/Text'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import React from 'react'

export default function DropdownConfiguracion() {

    const NAV_LINK_ALMACENES = [
        { label: 'Almacenes', href: '/dashboard/inventario/almacenes' },
        { label: 'Movimientos', href: '/dashboard/inventario/movimientos' },
    ];

    const NAV_LINK_PRODUCTOS = [
        { label : 'Categorias', href: '/dashboard/inventario/categoria' },
    ]

  return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
                <button
                    className="flex justify-center items-center hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors"
                >
                    <Text>Configuraciones</Text>
                </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44" align="start" sideOffset={5}>
              <DropdownMenuGroup>
                  <DropdownMenuLabel>Gestión de almacenes</DropdownMenuLabel>
                  {
                      NAV_LINK_ALMACENES.map((link) => (
                          <Link
                              key={link.href}
                              href={link.href}
                              className="block px-4 py-2 text-sm text-azulMarino hover:bg-gray-100"
                          >
                              {link.label}
                          </Link>
                      ))
                  }
                </DropdownMenuGroup>
              <DropdownMenuGroup>
                  <DropdownMenuLabel>Gestión de productos</DropdownMenuLabel>
                  {
                      NAV_LINK_PRODUCTOS.map((link) => (
                          <Link
                              key={link.href}
                              href={link.href}
                              className="block px-4 py-2 text-sm text-azulMarino hover:bg-gray-100"
                          >
                              {link.label}
                          </Link>
                      ))
                  }
                </DropdownMenuGroup>
          </DropdownMenuContent>
   </DropdownMenu>
  )
}
