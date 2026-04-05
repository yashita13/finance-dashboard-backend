"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, AlertCircle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { User } from "@/store/useAuthStore";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState("admin@test.com"); // helper default from readme
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.success) {
        const token = response.data.data.token;
        const decoded: any = jwtDecode(token);
        
        // Ensure user obj fits the store User interface
        const user: User = {
          id: decoded.id || "unknown",
          email: email,
          role: decoded.role || "VIEWER",
          isActive: true
        };

        setAuth(token, user);
        router.push("/");
      } else {
        setError(response.data.message || "Failed to login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      
      {/* Decorative Blob */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] rounded-full bg-[var(--color-primary-start)]/20 blur-[120px] -z-10"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-3xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--color-primary-start)] to-[var(--color-primary-end)] rounded-2xl flex items-center justify-center shadow-[0_0_30px_var(--color-primary-start)] mb-6"
            >
              <TrendingUp className="text-white w-8 h-8" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-white/50 text-sm">Sign in to your premium dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <Input
              type="email"
              placeholder="Email address"
              icon={<Mail className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[var(--color-danger)]/20 text-[#ff4d4d] px-4 py-3 rounded-xl border border-[var(--color-danger)]/30 flex items-center gap-3 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
              Sign In
            </Button>

            <p className="text-center text-sm text-white/50 pt-2 pb-2">
              Don't have an account? <Link href="/register" className="text-[var(--color-primary-start)] hover:underline font-semibold transition-colors ml-1">Sign up</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
