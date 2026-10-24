import React from 'react'

export default function PathCategoryDisplay({ path }) {
      const partes = path.split(' / ')
      return (
          <span className="text-sm">
              {partes.map((parte, i) => (
                  <React.Fragment key={i} >
                      {i > 0 && (
                          <span className="mx-1.5 select-none" style={{ color: 'rgba(31,47,87,0.25)' }}>&quot; / &quot; </span>
                      )}
                      <span style={{ color: i === partes.length - 1 ? '#1F2F57' : 'rgba(31,47,87,0.45)' }}>
                          {parte}
                      </span>
                  </React.Fragment>
              ))}
          </span>
      )
}
