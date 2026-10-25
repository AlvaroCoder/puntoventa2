import React from 'react'

export default function Field({ label, required, hint, children }) {
  return (
    <div
      className="grid items-start gap-6"
      style={{ gridTemplateColumns: "160px 1fr" }}
    >
      <div className="pt-2.5">
        <p className="text-sm font-semibold" style={{ color: "#1F2F57" }}>
          {label}
          {required && (
            <span className="ml-0.5" style={{ color: "#C0392B" }}>
              *
            </span>
          )}
        </p>
        {hint && (
          <p
            className="text-[11px] mt-0.5"
            style={{ color: "rgba(31,47,87,0.4)" }}
          >
            {hint}
          </p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}