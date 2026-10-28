"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-azulMarino hover:bg-azulMarino/90 text-white shadow-sm",
  secondary: "bg-verdeAgua hover:bg-verdeAgua/90 text-azulMarino",
  negative : "font-bold flex flex-row items-center gap-4 bg-white border-[1px] border-azulMarino hover:border-azulMarino/90 shadow-sm hover:bg-white text-azulMarino"
};

export default function AppButton({
  variant = "primary",
  className,
  children,
  ...props
}) {
  return (
    <Button
      className={cn(
        "flex items-center gap-2 font-bold",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
