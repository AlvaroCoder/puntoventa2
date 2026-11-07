import React from 'react'

export default function FieldRow({
    label,
    value
}) {
  return (
      <div className='flex flex-col gap-0.5'>
          <span
              className='text-[10px] uppercase tracking-wide font-medium'
              style={{color : 'rgba(31, 47, 87, 0.45)'}}
          >
              {label}
          </span>
          <span
              className='text-sm'
              style={{color : '#1F2F57'}}
          >
              {value || '-'}
          </span>
    </div>
  )
};