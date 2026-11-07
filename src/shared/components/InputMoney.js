import React from "react";

export default function InputMoney({
  value,
  onChange,
  warning,
  placeholder = "0.00",
}) {
  return (
    <div
      className={[
        "flex h-11 w-full items-stretch overflow-hidden rounded-lg border bg-white transition",
        warning
          ? "border-[#E8A020] ring-1 ring-[#E8A020]"
          : "border-[#1F2F57]/20 focus-within:border-[#3960A9] focus-within:ring-1 focus-within:ring-[#3960A9]",
      ].join(" ")}
    >
      <span className="flex shrink-0 items-center border-r border-[#1F2F57]/10 bg-[#E1E7F0]/65 px-3 text-sm font-bold text-[#1F2F57]/70">
        S/
      </span>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onWheel={(e) => e.currentTarget.blur()}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-[#1F2F57] outline-none placeholder:text-[#1F2F57]/35 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}
