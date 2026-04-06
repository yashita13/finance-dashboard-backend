"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface RequestItem {
  id: string;
  userId: string;
  requestedRole: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export const AccessRequestsTable = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/access-requests");
      if (res.data?.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/access-requests/${id}/approve`);
      toast.success("Request approved.");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to approve request.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.patch(`/access-requests/${id}/reject`);
      toast.success("Request rejected.");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to reject request.");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <Card className="p-0 overflow-hidden" disableHover>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--color-glass-border)] bg-white/5">
                  <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase">User</th>
                  <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase">Role Requested</th>
                  <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 text-[var(--color-primary-start)] animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-white/40">
                      No access requests found.
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {requests.map((r, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={r.id} 
                        className="border-b border-[var(--color-glass-border)]/50 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{r.user?.name || "Unknown"}</span>
                            <span className="text-white/50 text-xs">{r.user?.email || "-"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-white/70 text-sm">{r.requestedRole}</td>
                        <td className="py-4 px-6">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                            r.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' : 
                            r.status === 'APPROVED' ? 'bg-[var(--color-success)]/20 text-[#a3ffbd]' : 
                            'bg-[var(--color-danger)]/20 text-[#ffb3b3]'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {r.status === "PENDING" && (
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                onClick={() => handleApprove(r.id)} 
                                variant="primary"
                                className="!py-1.5 !px-3 !text-xs !bg-[var(--color-success)]/20 hover:!bg-[var(--color-success)]/40 !text-[#a3ffbd] shadow-none border border-[var(--color-success)]/30 min-w-0"
                              >
                                <Check className="w-3 h-3 mr-1" /> Approve
                              </Button>
                              <Button 
                                onClick={() => handleReject(r.id)} 
                                variant="secondary"
                                className="!py-1.5 !px-3 !text-xs !bg-[var(--color-danger)]/20 hover:!bg-[var(--color-danger)]/40 !text-[#ffb3b3] shadow-none border border-[var(--color-danger)]/30 min-w-0"
                              >
                                <X className="w-3 h-3 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
