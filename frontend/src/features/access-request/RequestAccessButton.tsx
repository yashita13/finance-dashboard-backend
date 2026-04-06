"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/services/api";
import { toast } from "sonner";
import { UserCheck } from "lucide-react";

export const RequestAccessButton = () => {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      await api.post("/access-requests");
      toast.success("Request for Analyst access submitted.");
      setRequested(true);
    } catch (err: any) {
      if (err.response?.data?.message === "You already have a pending request.") {
        setRequested(true);
      }
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  if (requested) {
    return (
      <div className="px-4 py-3 bg-[var(--color-glass)] rounded-xl border border-[var(--color-success)]/30 flex items-center justify-center gap-2">
        <UserCheck className="w-4 h-4 text-[var(--color-success)]" />
        <span className="text-xs text-[var(--color-success)] font-medium">Request Pending</span>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleRequest} 
      isLoading={loading}
      className="w-full text-xs font-semibold py-3"
      variant="primary"
    >
      Request Analyst Access
    </Button>
  );
};
