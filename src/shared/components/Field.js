import React, { useId } from "react";

export default function Field({
  label,
  required = false,
  optional = false,
  hint,
  error,
  inline = false,
  htmlFor,
  className = "",
  children,
}) {
  const autoId = useId();
  const id = htmlFor ?? autoId;

  const child =
    React.isValidElement(children) && !children.props.id
      ? React.cloneElement(children, { id })
      : children;

  return (
    <div
      className={[
        inline
          ? "grid items-start gap-x-6 gap-y-1.5 sm:grid-cols-[160px_minmax(0,1fr)]"
          : "flex flex-col gap-1.5",
        className,
      ].join(" ")}
    >
      <label htmlFor={id} className={inline ? "sm:pt-3" : ""}>
        <span className="text-sm font-semibold text-[#1F2F57]">
          {label}
          {required && <span className="ml-0.5 text-[#C0392B]">*</span>}
          {optional && (
            <span className="ml-1 font-normal text-[#1F2F57]/45">
              (opcional)
            </span>
          )}
        </span>
      </label>

      <div className="min-w-0">
        {child}
        {error ? (
          <p className="mt-1.5 text-xs font-semibold text-[#C0392B]">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-[#1F2F57]/50">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
