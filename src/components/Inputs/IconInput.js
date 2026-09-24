
export function IconInput({ icon: Icon, value, placeholder, onChange, ...props }) {
    return (
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-azulClaro"
          />
        )}
            <input
                className="focus-ring h-11 w-full rounded-lg border border-azulMarino/20 pl-10 pr-3 text-[15px]"
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                {...props}
            />
      </div>
    );
}
