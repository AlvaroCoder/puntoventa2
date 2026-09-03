import { cn } from "@/lib/utils";

export function Title({ className = "", children }) {
    return (
        <h1 className={cn(className, 'font-bold text-[#1F4363] text-2xl')}>
            {children}
        </h1>
    )
}