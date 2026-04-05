"use client";

import { TransactionsTable } from "@/features/transactions/TransactionsTable";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TransactionsPage() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === "VIEWER") {
      router.replace("/");
    }
  }, [user, router]);

  if (!user || user.role === "VIEWER") return null;

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      <div className="flex flex-col gap-2">
        <motion.h1 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-3xl font-bold text-white tracking-tight"
        >
          Transaction Records
        </motion.h1>
        <motion.p 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1 }}
           className="text-white/50"
        >
          Manage and review all your financial incomes and expenses.
        </motion.p>
      </div>

      <TransactionsTable />
    </div>
  );
}
