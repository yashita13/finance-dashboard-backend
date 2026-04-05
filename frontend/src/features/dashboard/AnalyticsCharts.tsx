"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/components/ui/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface ChartData {
  monthly: any[];
  categories: any[];
}

export const AnalyticsCharts = () => {
  const [data, setData] = useState<ChartData | null>(null);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/summary");
        if (res.data?.success) {
          const raw = res.data.data;
          
          const monthly = Object.entries(raw.monthlyTrends || {}).map(([key, value]: any) => ({
            name: key,
            Income: value.income,
            Expense: value.expense
          })).sort((a,b) => a.name.localeCompare(b.name));

          const categories = Object.entries(raw.categoryBreakdown || {}).map(([key, value]: any) => ({
            name: key,
            Expense: value.expense,
            Income: value.income
          })).sort((a,b) => b.Expense - a.Expense).slice(0, 5);
          
          setData({ monthly, categories });
        }
      } catch (err) {
        console.error("Failed to load charts", err);
      }
    };
    
    if (user) {
       fetchSummary();
    }
  }, [user]);

  if (!data) {
     return <div className="animate-pulse h-80 rounded-2xl bg-white/5 w-full mt-4" />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 w-full z-10 relative">
      <Card
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
         className="pt-6 h-[400px]"
         disableHover
      >
        <h3 className="text-white/90 font-semibold mb-6 px-2">Income vs Expense (Monthly)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="99%" height="100%">
            <AreaChart data={data.monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-glass)', borderColor: 'var(--color-glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                itemStyle={{ color: 'white' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="Income" stroke="var(--color-success)" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="Expense" stroke="var(--color-danger)" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, delay: 0.15, type: "spring", stiffness: 100 }}
         className="pt-6 h-[400px]"
         disableHover
      >
        <h3 className="text-white/90 font-semibold mb-6 px-2">Top Expenses by Category</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="99%" height="100%">
            <BarChart data={data.categories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="var(--color-primary-start)" />
                   <stop offset="100%" stopColor="var(--color-primary-end)" />
                 </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: 'var(--color-glass)', border: '1px solid var(--color-glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'white' }}
                itemStyle={{ color: 'white' }}
              />
              <Bar dataKey="Expense" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
