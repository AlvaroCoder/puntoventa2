import { Input } from "../ui/input";

export function IconInput({ icon: Icon, error, ...props }) {
    return (
        <div className="relative">
            <Icon size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
            <Input
                {...props}
                className={`pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E] ${error ? 'border-red-400' : ''}`}
            />
        </div>
    )
}
