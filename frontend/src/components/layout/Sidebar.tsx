"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ReceiptText, Users, LogOut, Server, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { RequestAccessButton } from "@/features/access-request/RequestAccessButton";

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPERADMIN", "ADMIN", "ANALYST", "VIEWER"] },
    { name: "Transactions", href: "/transactions", icon: ReceiptText, roles: ["SUPERADMIN", "ADMIN", "ANALYST"] },
    { name: "Users", href: "/users", icon: Users, roles: ["SUPERADMIN", "ADMIN"] },
    { name: "Access Requests", href: "/access-requests", icon: Server, roles: ["SUPERADMIN", "ADMIN"] },
    { name: "System Config", href: "/system", icon: Server, roles: ["SUPERADMIN"] },
  ];

  const filteredLinks = links.filter(link => user && link.roles.includes(user.role));

  return (
    <div className="w-64 flex-shrink-0 min-h-screen border-r border-[var(--color-glass-border)] bg-[var(--color-background)]/90 backdrop-blur-3xl sticky top-0 flex flex-col p-6 z-20">
      <div className="flex items-center justify-between gap-2 mb-10 pl-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary-start)] to-[var(--color-primary-end)] flex items-center justify-center shadow-[0_0_15px_var(--color-primary-start)]">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">MoneyBoard</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {user?.role === "VIEWER" && (
        <div className="mb-6 px-2">
          <RequestAccessButton />
        </div>
      )}

      <nav className="flex-1 space-y-2">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link key={link.name} href={link.href} onClick={onClose} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-start)]/20 to-transparent border-l-2 border-[var(--color-primary-start)] rounded-r-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                "relative z-10 flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
              )}>
                <link.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-[var(--color-glass-border)]">
        <div className="px-4 py-3 bg-[var(--color-glass)] rounded-xl border border-[var(--color-glass-border)] mb-4 flex flex-col gap-1">
          <span className="text-xs text-white/50 font-medium">Logged in as</span>
          <span className="text-sm font-semibold truncate text-white block">{user?.email}</span>
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-primary-start)] font-bold mt-1">{user?.role}</span>
        </div>
      </div>
    </div>
  );
};
