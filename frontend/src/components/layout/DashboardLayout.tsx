"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard } from "lucide-react";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!mounted || !token) {
    // Initial loading state or unauthenticated waiting redirect
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
           <LayoutDashboard className="w-12 h-12 text-[var(--color-primary-start)]" />
        </motion.div>
        {!token && mounted && (
          <p className="text-white/50 text-sm font-medium animate-pulse">Redirecting... Please refresh if stuck.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] selection:bg-[var(--color-primary-start)]/30 text-white font-sans antialiased relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 perspective-1000 relative">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, ease: "easeOut" }}
             className="max-w-7xl mx-auto"
          >
             {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
