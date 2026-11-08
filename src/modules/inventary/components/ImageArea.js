import { ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ImageArea({ imagenUrl, nombre, status }) {
  return (
    <div
      className="relative w-full h-40 rounded-xl overflow-hidden mb-2.5"
      style={{ border: "0.5px solid rgba(31,47,87,0.08)" }}
    >
      {imagenUrl ? (
        <Image
          src={imagenUrl}
          alt={nombre}
          fill
          sizes="200px"
          className="object-cover rounded-xl"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(31,47,87,0.05)" }}
        >
          <ImageIcon size={28} color="rgba(31,47,87,0.2)" strokeWidth={1.5} />
        </div>
      )}
      <span
        className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: status.bg, color: status.color }}
      >
        {status.label}
      </span>
    </div>
  );
}