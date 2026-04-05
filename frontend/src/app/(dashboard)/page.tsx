"use client";

import { OverviewCards } from "@/features/dashboard/OverviewCards";
import { AnalyticsCharts } from "@/features/dashboard/AnalyticsCharts";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      <div className="flex flex-col gap-2">
        <motion.h1 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-3xl font-bold text-white tracking-tight"
        >
          Financial Overview
        </motion.h1>
        <motion.p 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1 }}
           className="text-white/50"
        >
          Track your income, expenses, and overall balance.
        </motion.p>
      </div>

      <OverviewCards />
      <AnalyticsCharts />
    </div>
  );
}
