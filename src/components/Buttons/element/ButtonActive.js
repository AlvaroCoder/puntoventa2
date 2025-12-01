import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import React from 'react'

export default function ButtonActive() {
  return (
    <Popover>
        <PopoverTrigger>
            <Button>
                Activo
            </Button>
        </PopoverTrigger>
    </Popover>
  )
}