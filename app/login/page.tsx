"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                setError("Access Denied. Incorrect credentials.");
            }
        } catch (err) {
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass border border-white/5 rounded-[2.5rem] p-12 md:p-16 space-y-12 relative overflow-hidden bg-white/[0.02]">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-8">
                            <div className="w-8 h-8 bg-black rounded-lg" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-white luxury-text uppercase">
                            MANDI EDITOR
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold">
                            Restricted Access Gateway
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold ml-2">
                                Security Credential
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm md:text-base focus:outline-none focus:border-white/10 transition-all text-center tracking-[0.3em] font-light placeholder:text-white/5"
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500/80 text-[10px] uppercase tracking-widest font-bold text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative overflow-hidden group ${loading ? "bg-white/5 text-white/20" : "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
                                }`}
                        >
                            {loading ? "Verifying..." : "Enter Experience"}
                        </button>
                    </form>

                    <div className="pt-8 text-center">
                        <p className="text-[8px] uppercase tracking-widest text-white/10 font-medium">
                            Authorized Operations Only
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
