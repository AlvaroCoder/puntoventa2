import React from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export default function ButtonsLoading() {
  return (
    <Button
    className=' flex flex-row items-center py-6 rounded-2xl text-white bg-rojoEncendido mr-4  border '

    >
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
    </Button>
  )
}
