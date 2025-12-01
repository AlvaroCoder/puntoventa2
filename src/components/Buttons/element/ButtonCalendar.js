import React, { useState } from 'react'
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import Calendar from 'react-calendar'
export default function ButtonCalendar() {
    const [valueToday, setValueToday] = useState(new Date());
    console.log(valueToday);
    
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button>
               <p>{valueToday.toDateString()}</p>
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <div>
                <Calendar value={valueToday} onChange={setValueToday} />
            </div>
        </PopoverContent>
    </Popover>
  )
}
