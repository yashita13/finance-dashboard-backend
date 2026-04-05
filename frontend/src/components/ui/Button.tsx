"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export const Button = ({ className, variant = "primary", isLoading, children, ...props }: ButtonProps) => {
  const baseClass = "relative overflow-hidden rounded-xl px-6 py-3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-[var(--color-primary-start)] to-[var(--color-primary-end)] text-white shadow-[0_0_15px_var(--color-primary-start)] hover:shadow-[0_0_25px_var(--color-primary-start)]",
    secondary: "bg-[var(--color-secondary)]/20 text-white border border-[var(--color-secondary)]/30 hover:bg-[var(--color-secondary)]/40",
    danger: "bg-[var(--color-danger)]/20 text-[#ff4d4d] border border-[var(--color-danger)]/30 hover:bg-[var(--color-danger)]/40",
    ghost: "bg-transparent text-[var(--color-foreground)] hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseClass, variants[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </div>
    </motion.button>
  );
};
