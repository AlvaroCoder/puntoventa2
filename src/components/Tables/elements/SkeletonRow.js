import React from 'react'

export default function SkeletonRow({
    cols = 4
}) {
    const widths = [30, 20, 50, 25, 20]
  return (
        <tr className="border-b border-gray-50">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3.5">
                    <div
                        className="h-4 bg-gray-100 rounded animate-pulse"
                        style={{ width: `${widths[i % widths.length]}%` }}
                    />
                </td>
            ))}
        </tr>
  )
};
