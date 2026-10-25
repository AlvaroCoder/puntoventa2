import React from 'react'

export default function SkeletonCard() {
    return (
      <div
        className="bg-white rounded-xl p-5 flex flex-col gap-4 animate-pulse"
        style={{ border: "0.5px solid rgba(31,47,87,0.1)" }}
      >
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-xl shrink-0"
            style={{ background: "rgba(31,47,87,0.08)" }}
          />
          <div className="flex-1 flex flex-col gap-2 pt-1">
            <div
              className="h-3 rounded-md w-2/3"
              style={{ background: "rgba(31,47,87,0.08)" }}
            />
            <div
              className="h-2 rounded-md w-1/3"
              style={{ background: "rgba(31,47,87,0.05)" }}
            />
          </div>
        </div>
        {[70, 50, 40, 45].map((w, i) => (
          <div
            key={i}
            className="h-2.5 rounded"
            style={{ width: `${w}%`, background: "rgba(31,47,87,0.05)" }}
          />
        ))}
      </div>
    );
}
