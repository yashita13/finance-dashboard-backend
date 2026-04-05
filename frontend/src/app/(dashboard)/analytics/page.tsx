"use client";

import { AnalyticsCharts } from "@/features/dashboard/AnalyticsCharts";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      <div className="flex flex-col gap-2">
        <motion.h1 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-3xl font-bold text-white tracking-tight"
        >
          Detailed Analytics
        </motion.h1>
        <motion.p 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1 }}
           className="text-white/50"
        >
          In-depth breakdowns of your financial summaries over time.
        </motion.p>
      </div>

      <AnalyticsCharts />
    </div>
  );
}
