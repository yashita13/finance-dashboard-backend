"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { api } from "@/services/api";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const OverviewCards = () => {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/summary");
        if (res.data?.success) setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch summary", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
       fetchSummary();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
         {[1,2,3].map(i => <Card key={i} className="h-40 animate-pulse bg-white/5 border-white/5 flex items-center justify-center" disableHover />)}
      </div>
    );
  }

  const items = [
    { title: "Net Balance", value: data?.balance || 0, icon: Wallet, color: "var(--color-primary-start)", bg: "from-[var(--color-primary-start)]/20 to-transparent" },
    { title: "Total Income", value: data?.totalIncome || 0, icon: ArrowUpRight, color: "var(--color-success)", bg: "from-[var(--color-success)]/20 to-transparent" },
    { title: "Total Expense", value: data?.totalExpense || 0, icon: ArrowDownRight, color: "var(--color-danger)", bg: "from-[var(--color-danger)]/20 to-transparent" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
      {items.map((item, i) => (
        <Card 
          key={item.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
          className="relative overflow-hidden"
        >
          <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-[40px] bg-gradient-to-br ${item.bg}`} />
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--color-glass)] border border-[var(--color-glass-border)] shadow-lg relative overflow-hidden">
               <div className={`absolute inset-0 bg-gradient-to-br transition-opacity ${item.bg} opacity-50`} />
               <item.icon className="w-6 h-6 relative z-10" style={{ color: item.color }} />
            </div>
          </div>
          <div className="text-white/60 text-sm font-medium mb-2 tracking-wide uppercase">{item.title}</div>
          <div className="text-4xl font-bold font-mono text-white tracking-tight">
            ${item.value.toLocaleString()}
          </div>
        </Card>
      ))}
    </div>
  );
};
