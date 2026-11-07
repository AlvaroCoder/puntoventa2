import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import React, { useRef } from 'react'

export default function ImageUpload({
    value, onChange
}) {
    const inputRef = useRef(null);
    const handleFile = (file) => {
        if (!file) return;
        onChange({ file, preview: URL.createObjectURL(file) });
    }
    const clear = (e) => { e.stopPropagation(); onChange(null); }
return (
  <div>
    <div
      onClick={() => inputRef.current?.click()}
      className="relative flex items-center justify-center rounded-xl cursor-pointer transition-all overflow-hidden"
      style={{
        height: value ? 120 : 88,
        border: value ? "none" : "1.5px dashed rgba(31,47,87,0.2)",
        background: value ? "transparent" : "rgba(31,47,87,0.02)",
      }}
      onMouseEnter={(e) => {
        if (!value) e.currentTarget.style.borderColor = "#3960A9";
      }}
      onMouseLeave={(e) => {
        if (!value) e.currentTarget.style.borderColor = "rgba(31,47,87,0.2)";
      }}
    >
      {value ? (
        <>
          <Image
            src={value.preview}
            alt="preview"
            className="w-full h-full object-cover rounded-xl"
          />
          <button
            onClick={clear}
            type="button"
            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md transition-opacity hover:opacity-80"
          >
            <X size={12} style={{ color: "#1F2F57" }} />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <ImageIcon
            size={22}
            strokeWidth={1.5}
            style={{ color: "rgba(31,47,87,0.25)" }}
          />
          <p className="text-xs" style={{ color: "rgba(31,47,87,0.4)" }}>
            Haz clic para subir una imagen
          </p>
          <p className="text-[10px]" style={{ color: "rgba(31,47,87,0.3)" }}>
            PNG, JPG · Opcional
          </p>
        </div>
      )}
    </div>
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => handleFile(e.target.files?.[0])}
    />
  </div>
);
}