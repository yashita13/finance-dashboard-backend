import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-[var(--color-glass)] border border-[var(--color-glass-border)] rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-start)] transition-all",
            icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
