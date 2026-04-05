"use client";

import { SystemPanel } from "@/features/system/SystemPanel";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SystemPage() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "SUPERADMIN") {
      router.replace("/");
    }
  }, [user, router]);

  if (!user || user.role !== "SUPERADMIN") return null;

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      <div className="flex flex-col gap-2">
        <motion.h1 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-3xl font-bold text-white tracking-tight"
        >
          Core System Interface
        </motion.h1>
        <motion.p 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1 }}
           className="text-white/50"
        >
          Super Administrative aggregate insights and system boundaries.
        </motion.p>
      </div>

      <SystemPanel />
    </div>
  );
}
