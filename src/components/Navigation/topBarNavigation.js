'use client'
import { useSession } from '@/hooks/useHooks';
import React, { useEffect, useState } from 'react'
import { ButtonDropdownProfile, ButtonsLoading } from '../Buttons';

export default function TopBarNavigation() {
  const [currentTime, setCurrentTime] = useState("");
  const {loading : loadingDataSession, dataSession} = useSession();
  
  useEffect(()=>{
    const updateDate=()=>{
      const now = new Date();
      const option = { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" };
      const formattedDate = now.toLocaleDateString('es-ES',option);
      setCurrentTime(formattedDate);
    }
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return ()=>clearInterval(interval);
  },[]);
  return (
    <nav className='w-full h-24 shadow-md flex flex-row items-center justify-between px-8'>
      <div>
        <h1 className='font-bold text-xl'>PipoDashboard App</h1>
        <p className='text-sm'>{currentTime}</p>
      </div>
      <div>
        {
          loadingDataSession?
          <ButtonsLoading/>:
          <ButtonDropdownProfile username={dataSession?.username}/>
        }
      </div>
    </nav>
  )
}
