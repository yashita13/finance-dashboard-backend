"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  gradientOffset?: string;
  disableHover?: boolean;
}

export const Card = ({ className, children, gradientOffset = "50%", disableHover = false, ...props }: CardProps) => {
  return (
    <motion.div
      whileHover={!disableHover ? { y: -5, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-glass)] backdrop-blur-xl shadow-xl overflow-hidden group",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundPosition: gradientOffset }}
      />
      <div className="relative z-10 p-6 h-full w-full">{children}</div>
    </motion.div>
  );
};
