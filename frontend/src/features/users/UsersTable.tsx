"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/components/ui/Card";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const UsersTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore(state => state.user);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      if (res.data?.success) setUsers(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await api.patch(`/users/${id}`, { role: newRole });
      toast.success("User role updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleActiveToggle = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/users/${id}`, { isActive: !isActive });
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  if (currentUser?.role !== "SUPERADMIN" && currentUser?.role !== "ADMIN") {
      return (
         <Card className="p-8 text-center bg-[var(--color-danger)]/10 border-[var(--color-danger)]/20" disableHover>
           <ShieldAlert className="w-12 h-12 text-[var(--color-danger)] mx-auto mb-4" />
           <p className="text-white/70">You don't have permission to view User Management.</p>
         </Card>
      );
  }

  return (
    <Card className="p-0 overflow-hidden" disableHover>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-[var(--color-glass-border)]">
            <tr>
              <th className="py-4 px-6 text-xs text-white/50 uppercase tracking-wider">Email</th>
              <th className="py-4 px-6 text-xs text-white/50 uppercase tracking-wider">Role</th>
              <th className="py-4 px-6 text-xs text-white/50 uppercase tracking-wider text-center">Status</th>
              <th className="py-4 px-6 text-xs text-white/50 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-12"><Loader2 className="w-6 h-6 mx-auto animate-spin text-[var(--color-primary-start)]" /></td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="border-b border-[var(--color-glass-border)]/50 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 text-white font-medium">{u.email}</td>
                <td className="py-4 px-6">
                   <select 
                     value={u.role}
                     onChange={(e) => handleRoleChange(u.id, e.target.value)}
                     disabled={currentUser?.role !== "SUPERADMIN" && u.role === "SUPERADMIN"}
                     className="bg-[var(--color-background)] border border-white/20 text-white rounded-lg px-3 py-1.5 text-sm outline-none md:w-36 focus:ring-2 focus:ring-[var(--color-primary-start)] disabled:opacity-50"
                   >
                     <option value="VIEWER">VIEWER</option>
                     <option value="ANALYST">ANALYST</option>
                     <option value="ADMIN">ADMIN</option>
                     <option value="SUPERADMIN">SUPERADMIN</option>
                   </select>
                </td>
                <td className="py-4 px-6 text-center">
                   <div className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${u.isActive ? 'bg-[var(--color-success)]/20 text-[#a3ffbd]' : 'bg-[var(--color-danger)]/20 text-[#ffb3b3]'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                   </div>
                </td>
                <td className="py-4 px-6 text-right">
                   <button 
                     onClick={() => handleActiveToggle(u.id, u.isActive)}
                     className={`px-4 py-1.5 text-xs rounded-lg font-semibold transition-colors ${u.isActive ? 'bg-[var(--color-danger)]/20 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/40 hover:text-white' : 'bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/40 hover:text-white'}`}
                   >
                     {u.isActive ? 'Deactivate' : 'Activate'}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
