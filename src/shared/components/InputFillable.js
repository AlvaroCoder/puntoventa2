import React from 'react'

export default function InputFillable({
    value,
    keyValue,
    set = () => { },
    onFocus = () => { },
    onBlur = () => { },
    placeholder = "",
    nombreFocused=true
}) {
  return (
      <input
          value={value}
          onChange={e => set(keyValue, e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className='text-[26px] font-bold outline-none bg-transparent w-full pb-1.5 transition-all placeholder:font-normal'
          style={{
              color: '#1F2F57',
              borderBottom: `2px solid ${nombreFocused ? '#3960A9' : 'rgba(31,47,87,0.12)'}`,
              caretColor : '#3960A9'
          }}
      />
  )
};