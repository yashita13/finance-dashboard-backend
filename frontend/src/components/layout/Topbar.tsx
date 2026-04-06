"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { LogOut, Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export const Topbar = ({ onOpenSidebar }: { onOpenSidebar?: () => void }) => {
  const logout = useAuthStore(state => state.logout);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };
  
  const titleMap: Record<string, string> = {
    "/": "Overview",
    "/transactions": "Transactions",
    "/analytics": "Analytics",
    "/users": "User Management"
  };

  const currentTitle = titleMap[pathname] || "Dashboard";

  return (
    <header className="h-20 border-b border-[var(--color-glass-border)] bg-[var(--color-background)]/40 backdrop-blur-md sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onOpenSidebar} className="md:hidden p-2 -ml-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold text-white">
          {currentTitle}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative">
          <Bell className="w-5 h-5 text-white/70" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-primary-start)] rounded-full shadow-[0_0_8px_var(--color-primary-start)]" />
        </button>
        <Button variant="ghost" className="px-4 py-2 text-white/70 hover:text-[#ff4d4d]" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
