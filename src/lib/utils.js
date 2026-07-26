import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const arrayToDate = (arr) => {
    if (!Array.isArray(arr) || arr.length < 3) return null;

    const [year, month, day, hour = 0, minute = 0, second = 0] = arr;

    return new Date(year, month - 1, day, hour, minute, second);
};
  
export const fmtDate = d =>
    d
        ? new Date(d).toLocaleString('es-PE', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    : '—';
        
