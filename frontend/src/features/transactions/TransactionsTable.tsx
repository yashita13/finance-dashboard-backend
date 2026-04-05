"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Search, Plus, Loader2, ArrowUpRight, ArrowDownRight, Edit2, Trash2, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RecordItem {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  createdAt: string;
}

export const TransactionsTable = () => {
  const user = useAuthStore(state => state.user);
  
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);
  
  // Form State
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const typeQuery = typeFilter !== "ALL" ? `&type=${typeFilter}` : "";
      const res = await api.get(`/records?page=${page}&limit=7&search=${search}${typeQuery}`);
      if (res.data?.success) {
        setRecords(res.data.data);
        setTotalPages(res.data.meta.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
       fetchRecords();
    }, 300); // debounce search
    return () => clearTimeout(timer);
  }, [page, search, typeFilter]);

  const canManage = user?.role === "SUPERADMIN" || user?.role === "ADMIN";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { amount: Number(amount), type, category, date };
      if (editingRecord) {
        await api.put(`/records/${editingRecord.id}`, payload);
      } else {
        await api.post("/records", payload);
      }
      setIsModalOpen(false);
      fetchRecords(); // refresh
    } catch (err) {
      console.error("Failed to save record", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/records/${id}`);
      fetchRecords(); // refresh
    } catch (err) {
      console.error("Failed to delete record", err);
    }
  };

  const openForm = (record?: RecordItem) => {
    if (record) {
      setEditingRecord(record);
      setAmount(record.amount.toString());
      setType(record.type);
      setCategory(record.category);
      setDate(new Date(record.date).toISOString().split('T')[0]);
    } else {
      setEditingRecord(null);
      setAmount("");
      setType("EXPENSE");
      setCategory("");
      setDate(new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input 
            placeholder="Search records..." 
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <select 
            className="bg-[var(--color-glass)] border border-[var(--color-glass-border)] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-start)] appearance-none cursor-pointer"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        
        {canManage && (
          <Button onClick={() => openForm()} className="whitespace-nowrap w-full sm:w-auto shadow-[0_0_20px_var(--color-primary-start)] px-6">
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </Button>
        )}
      </div>

      {/* Table Card */}
      <Card className="p-0 overflow-hidden" disableHover>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-glass-border)] bg-white/5">
                <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider text-right">Amount</th>
                {canManage && (
                  <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-[var(--color-primary-start)] animate-spin mx-auto" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="py-16 text-center text-white/40">
                    No records found matching your filters.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {records.map((r, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={r.id} 
                      className="border-b border-[var(--color-glass-border)]/50 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-3 px-6 whitespace-nowrap">
                        <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-md w-fit ${r.type === 'INCOME' ? 'bg-[var(--color-success)]/20 text-[#a3ffbd]' : 'bg-[var(--color-danger)]/20 text-[#ffb3b3]'}`}>
                          {r.type === 'INCOME' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {r.type}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-white font-medium">{r.category}</td>
                      <td className="py-3 px-6 text-white/70 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="py-3 px-6 font-mono font-bold text-right text-lg text-white">
                        {r.type === 'EXPENSE' ? '-' : '+'}${r.amount.toLocaleString()}
                      </td>
                      {canManage && (
                        <td className="py-3 px-6 text-right whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openForm(r)} className="p-2 text-white/50 hover:text-white transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="p-2 text-[var(--color-danger)]/70 hover:text-[var(--color-danger)] transition-colors ml-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[var(--color-glass-border)] bg-black/10">
             <span className="text-white/50 text-sm">Page {page} of {totalPages}</span>
             <div className="flex items-center gap-2">
                <Button variant="secondary" className="py-2 px-4 text-sm rounded-lg" disabled={page === 1} onClick={() => setPage(p => p-1)}>Previous</Button>
                <Button variant="secondary" className="py-2 px-4 text-sm rounded-lg" disabled={page === totalPages} onClick={() => setPage(p => p+1)}>Next</Button>
             </div>
          </div>
        )}
      </Card>

      {/* Transaction Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRecord ? "Edit Transaction" : "New Transaction"}>
        <form onSubmit={handleSave} className="space-y-5">
           <div className="grid grid-cols-2 gap-4 bg-[var(--color-glass)] p-1 rounded-xl glass-panel relative z-10 p-2 border border-white/10 mb-4">
              <button 
                type="button"
                className={`py-2 text-sm font-semibold rounded-lg transition-all ${type === 'INCOME' ? 'bg-[var(--color-success)]/80 text-white shadow-[0_0_15px_var(--color-success)]' : 'text-white/50 hover:text-white'}`}
                onClick={() => setType('INCOME')}
              >
                Income
              </button>
              <button 
                type="button"
                className={`py-2 text-sm font-semibold rounded-lg transition-all ${type === 'EXPENSE' ? 'bg-[var(--color-danger)]/80 text-white shadow-[0_0_15px_var(--color-danger)]' : 'text-white/50 hover:text-white'}`}
                onClick={() => setType('EXPENSE')}
              >
                Expense
              </button>
           </div>
           
           <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 ms-1">Amount</label>
              <Input type="number" min="0" step="0.01" placeholder="e.g 1000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
           </div>

           <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 ms-1">Category</label>
              <Input type="text" placeholder="e.g Salary, Food, Rent..." value={category} onChange={(e) => setCategory(e.target.value)} required />
           </div>

           <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 ms-1">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
           </div>

           <Button type="submit" className="w-full mt-6" isLoading={formLoading}>
              {editingRecord ? "Save Changes" : "Create Record"}
           </Button>
        </form>
      </Modal>
    </div>
  );
};
