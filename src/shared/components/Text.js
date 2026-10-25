import React from 'react'

export default function Text({children}) {
  return (
      <p
        className="text-xs mt-0.5"
        style={{ color: "rgba(31,47,87,0.55)" }}
      >
          {children}
      </p>
  )
}