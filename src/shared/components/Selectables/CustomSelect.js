import { Check, ChevronDown } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  labelKey = "nombre",
  valueKey = "id",
  placeholder = "Selecciona una opción",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  const items = options.map((o) =>
    typeof o === "object" && o !== null
      ? { value: o[valueKey], label: o[labelKey] }
      : { value: o, label: o },
  );

  const selectedIndex = items.findIndex((i) => i.value == value);
  const selected = selectedIndex >= 0 ? items[selectedIndex] : null;

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open || highlight < 0 || !listRef.current) return;
    const el = listRef.current.children[highlight];
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const handlePick = (item) => {
    onChange(item.value);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) return setOpen(true);
        setHighlight((h) => Math.min(h + 1, items.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) return setOpen(true);
        setHighlight((h) => Math.max(h - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && items[highlight]) handlePick(items[highlight]);
        else setOpen(true);
        break;
      case "Escape":
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        className="flex items-center justify-between gap-2 h-11 px-3.5 rounded-lg w-full text-left text-[15px] transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          border: `1px solid ${open ? "#3960A9" : "rgba(31,47,87,0.18)"}`,
          color: selected ? "#1F2F57" : "rgba(31,47,87,0.38)",
          background: "#fff",
          boxShadow: open ? "0 0 0 3px rgba(57,96,169,0.1)" : "none",
        }}
      >
        <span className="truncate text-sm">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={15}
          color="rgba(31,47,87,0.4)"
          className="shrink-0"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s ease",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl overflow-hidden"
          style={{
            border: "0.5px solid rgba(31,47,87,0.14)",
            boxShadow: "0 12px 40px rgba(31,47,87,0.14)",
          }}
        >
          <div ref={listRef} className="max-h-56 overflow-y-auto py-1">
            {items.map((item, idx) => {
              const isActive = value == item.value;
              const isHighlighted = idx === highlight;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handlePick(item)}
                  onMouseEnter={() => setHighlight(idx)}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors"
                  style={{
                    background: isActive
                      ? "rgba(57,96,169,0.06)"
                      : isHighlighted
                        ? "rgba(31,47,87,0.04)"
                        : "transparent",
                  }}
                >
                  <span
                    className="text-sm truncate"
                    style={{
                      color: "#1F2F57",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <Check
                      size={14}
                      color="#3960A9"
                      strokeWidth={2.5}
                      className="shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
