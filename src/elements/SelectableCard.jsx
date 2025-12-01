import React from "react";

export default function SelectableCard({ selected, onClick, icon: Icon, title, desc }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-3 hover:shadow-md ${
        selected
          ? "border-[#FF821E] bg-[#FF821E]/5"
          : "border-gray-100 bg-white hover:border-[#1F4363]/30"
      }`}
    >
      <div
        className={`p-3 rounded-full ${
          selected ? "bg-[#FF821E] text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        <Icon size={24} />
      </div>
      <div>
        <h4
          className={`font-bold text-sm ${
            selected ? "text-[#FF821E]" : "text-[#333333]"
          }`}
        >
          {title}
        </h4>
        {desc && <p className="text-xs text-gray-400 mt-1">{desc}</p>}
      </div>
    </div>
  );
}
