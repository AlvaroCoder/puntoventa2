import React from 'react'

export default function MetricCard({ label, value, sub, accent, onSubClick }) {
  if (accent) {
    return (
      <div
        className="rounded-xl px-5 py-4 flex flex-col gap-1 min-w-0"
        style={{
          background: "#FFF7EE",
          border: "1.5px solid rgba(232,160,32,0.55)",
        }}
      >
        <p className="text-xs font-semibold" style={{ color: "#D97706" }}>
          {label}
        </p>
        <p
          className="text-[22px] font-extrabold leading-tight"
          style={{ color: "#D97706" }}
        >
          {value}
        </p>
        {sub && (
          <button
            onClick={onSubClick}
            className="text-xs font-medium text-left hover:underline w-fit"
            style={{ color: "#D97706" }}
          >
            {sub} →
          </button>
        )}
      </div>
    );
  }
  return (
    <div
      className="bg-white rounded-xl px-5 py-4 flex flex-col gap-1 min-w-0"
      style={{ border: "0.5px solid rgba(31,47,87,0.12)" }}
    >
      <p className="text-xs" style={{ color: "rgba(31,47,87,0.5)" }}>
        {label}
      </p>
      <p
        className="text-[22px] font-extrabold leading-tight"
        style={{ color: "#1F2F57" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: "rgba(31,47,87,0.4)" }}>
          {sub}
        </p>
      )}
    </div>
  );
};