import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';

export default function ButtonDropdownProfile({username=""}) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className="flex flex-row items-center py-6 rounded-2xl text-white bg-rojoPasion hover:bg-rojoEncendido hover:text-white border-rojoEncendido mr-4"
            >
                <AccountCircleIcon className='text-xl'/>
                <p className='ml-4 hidden lg:block font-bold'>{username}</p>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>
                Mi cuenta
            </DropdownMenuLabel>
            <DropdownMenuItem>
                <Button
                    variant="ghost"
                    className="flex items-center justify-center"
                >
                    <p><PersonIcon/><span className='ml-2'>Ver perfil</span></p>
                </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu> 
  )
}
