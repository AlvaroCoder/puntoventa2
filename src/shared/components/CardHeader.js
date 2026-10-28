import React from 'react'

export default function CardHeader({
    title,
    action
}) {
  return (
      <div
        className='flex items-center justify-between px-5 py-3.5'
        style={{borderBottom : "0.5px solid rgba(31, 47, 87, 0.07)"}}
      >
          <span>
              {title}
          </span>
          {action && action}
    </div>
  )
};