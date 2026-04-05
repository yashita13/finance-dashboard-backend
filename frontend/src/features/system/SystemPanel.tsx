"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { Users, Server, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

interface MetricType {
  totalUsers: number;
  activeUsers: number;
  admins: number;
  roles: any[];
}

export const SystemPanel = () => {
  const [metrics, setMetrics] = useState<MetricType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemMetrics = async () => {
      try {
        const res = await api.get("/users");
        if (res.data?.success) {
          const allUsers = res.data.data;
          
          let rawRoles: any = {};
          let active = 0;
          let adminsCount = 0;

          allUsers.forEach((u: any) => {
             if (u.isActive) active++;
             if (u.role === "ADMIN" || u.role === "SUPERADMIN") adminsCount++;
             if (!rawRoles[u.role]) rawRoles[u.role] = 0;
             rawRoles[u.role]++;
          });

          const rolesFormatted = Object.entries(rawRoles).map(([name, value]) => ({ name, value }));

          setMetrics({
            totalUsers: allUsers.length,
            activeUsers: active,
            admins: adminsCount,
            roles: rolesFormatted
          });
        }
      } catch (err) {
        console.error("Failed loading system metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSystemMetrics();
  }, []);

  if (loading) {
     return <div className="animate-pulse h-80 rounded-2xl bg-white/5 w-full mt-4" />;
  }

  const COLORS = ['#9b30ff', '#10b981', '#f43f5e', '#3b82f6'];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-6">
           <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[var(--color-primary-start)]/20 text-[#a370ff]">
              <Users className="w-6 h-6" />
           </div>
           <div>
              <p className="text-white/50 text-sm font-semibold uppercase tracking-wide">Total Users</p>
              <p className="text-3xl font-bold text-white mt-1">{metrics?.totalUsers || 0}</p>
           </div>
        </Card>

        <Card className="flex items-center gap-6">
           <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[var(--color-success)]/20 text-[#a3ffbd]">
              <Activity className="w-6 h-6" />
           </div>
           <div>
              <p className="text-white/50 text-sm font-semibold uppercase tracking-wide">Active Actors</p>
              <p className="text-3xl font-bold text-white mt-1">{metrics?.activeUsers || 0}</p>
           </div>
        </Card>

        <Card className="flex items-center gap-6">
           <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[var(--color-danger)]/20 text-[#ffb3b3]">
              <ShieldCheck className="w-6 h-6" />
           </div>
           <div>
              <p className="text-white/50 text-sm font-semibold uppercase tracking-wide">Administrators</p>
              <p className="text-3xl font-bold text-white mt-1">{metrics?.admins || 0}</p>
           </div>
        </Card>
      </div>

      <Card className="pt-6 h-[400px]" disableHover>
        <h3 className="text-white/90 font-semibold mb-2 px-2">Role Distribution</h3>
        <p className="px-2 text-sm text-white/40 mb-6">Aggregate density map of current system authorizations.</p>
        <div className="h-[260px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={metrics?.roles || []}
                 innerRadius={70}
                 outerRadius={100}
                 paddingAngle={5}
                 dataKey="value"
                 stroke="none"
               >
                 {(metrics?.roles || []).map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-glass)', border: '1px solid var(--color-glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'white' }}
                  itemStyle={{ color: 'white' }}
               />
             </PieChart>
           </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
