"use client";

export default function PageLoader({ message = "Preparando tu tienda..." }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "#1A2845" }}
    >
      <style>{`
        @keyframes fillProgress {
          0%   { width: 0%; }
          60%  { width: 50%; }
          100% { width: 55%; }
        }
        .loader-progress {
          width: 0%;
          animation: fillProgress 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <svg
        width="130"
        height="130"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="white"
          strokeWidth="7"
          fill="none"
          strokeDasharray="286 28"
          strokeLinecap="round"
          transform="rotate(126 60 60)"
        />
        <text
          x="60"
          y="78"
          textAnchor="middle"
          fill="white"
          fontSize="50"
          fontWeight="800"
          fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
        >
          P
        </text>
      </svg>

      <h1
        className="font-bold text-3xl mt-4 mb-7 tracking-tight"
        style={{ color: "white" }}
      >
        PuntoVenta 360
      </h1>

      <div
        className="w-72 rounded-full"
        style={{
          height: "5px",
          background: "rgba(255,255,255,0.14)",
        }}
      >
        <div
          className="loader-progress h-full rounded-full"
          style={{ background: "#198E7B" }}
        />
      </div>

      <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.6)" }}>
        {message}
      </p>

      <p
        className="absolute bottom-8 text-xs"
        style={{ color: "rgba(255,255,255,0.28)" }}
      >
        Versión 1.0 · Hecho en Perú{" "}
        <a
          href="https://www.alvaco.dev/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Develop by @alvaco.dev
        </a>
      </p>
    </div>
  );
}
