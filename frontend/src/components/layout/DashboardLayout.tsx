"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard } from "lucide-react";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated()) {
    // Initial loading state or unauthenticated waiting redirect
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
           <LayoutDashboard className="w-12 h-12 text-[var(--color-primary-start)]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] selection:text-white max-w-[100vw] overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative w-full h-full min-h-screen">
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-8 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-7xl mx-auto h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
