import React from "react";
export default function FieldLegend({ icon, label, description }) {
  return (
    <legend className="mb-4 w-full">
      <div
        className="
        flex items-center gap-2
        border-b border-[#1F2F57]/[0.08]
        pb-3
      "
      >
        <span
          className="
          flex h-7 w-7 shrink-0
          items-center justify-center
          rounded-[8px]
          bg-[#3960A9]/[0.07]
          text-[#3960A9]
        "
        >
          {React.cloneElement(icon, {
            size: 15,
            strokeWidth: 1.8,
          })}
        </span>

        <div className="min-w-0">
          <h3
            className="
            text-[11px] font-extrabold
            uppercase tracking-[0.10em]
            text-[#3960A9]
          "
          >
            {label}
          </h3>

          {description && (
            <p
              className="
              mt-0.5 text-[11px]
              text-[#1F2F57]/45
            "
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </legend>
  );
}
