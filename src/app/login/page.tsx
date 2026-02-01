"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShieldCheck,
    Lock,
    Cpu,
    Fingerprint,
    ChevronRight,
    Loader2,
    Database,
    Network
} from 'lucide-react';

const LoginPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [bootStep, setBootStep] = useState(0);
    const [formData, setFormData] = useState({ email: '', password: '' });

    // Simulate boot sequence
    useEffect(() => {
        const timer = setInterval(() => {
            setBootStep(prev => (prev < 4 ? prev + 1 : prev));
        }, 400);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate authentication
        setTimeout(() => {
            router.push('/inbox');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-6 relative overflow-hidden font-inter">
            {/* Animated Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-seedlink-green/10 rounded-full blur-[120px] animate-pulse duration-[8s]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-accent/5 rounded-full blur-[120px] animate-pulse duration-[10s]"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <main className="w-full max-w-md relative z-10 space-y-8">
                {/* Brand Header */}
                <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex p-3 rounded-2xl bg-seedlink-green-soft border border-seedlink-green/20 mb-4 shadow-2xl shadow-seedlink-green/20">
                        <div className="w-10 h-10 rounded-lg bg-seedlink-green flex items-center justify-center text-white font-black text-xl shadow-lg">S</div>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Seedlink</h1>
                    <div className="flex items-center justify-center gap-4 text-[10px] font-black text-slate-grey uppercase tracking-[0.3em]">
                        <span className="flex items-center gap-1.5"><Database size={10} /> Node: 001</span>
                        <span className="w-1 h-1 rounded-full bg-slate-grey/30"></span>
                        <span className="flex items-center gap-1.5"><Network size={10} /> Auth Protocol: V4</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group animate-in zoom-in-95 duration-700 delay-200">
                    {/* Interior Scanline Effect */}
                    <div className="absolute inset-x-0 h-px bg-white/10 top-0 animate-scan"></div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-grey uppercase tracking-[0.2em] ml-2 mb-2 block">Identity Code</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        placeholder="agent@seedlink.corp"
                                        className="w-full bg-white/5 border border-white/5 focus:border-seedlink-green/30 focus:ring-8 focus:ring-seedlink-green/5 rounded-2xl px-5 py-4 text-white text-sm outline-none transition-all placeholder:text-white/10 font-medium"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <Cpu className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-seedlink-green transition-colors" size={18} />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-grey uppercase tracking-[0.2em] ml-2 mb-2 block">Secure Key</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/5 focus:border-seedlink-green/30 focus:ring-8 focus:ring-seedlink-green/5 rounded-2xl px-5 py-4 text-white text-sm outline-none transition-all placeholder:text-white/10 font-medium font-mono"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-seedlink-green transition-colors" size={18} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-16 rounded-2xl bg-seedlink-green flex items-center justify-center gap-3 text-white text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-seedlink-green/20 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group/btn ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <ShieldCheck size={20} className="group-hover/btn:rotate-12 transition-transform" />
                                    <span>Authenticate</span>
                                    <ChevronRight size={18} className="opacity-40 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
                        </button>
                    </form>
                </div>

                {/* System Diagnostics (Visual Only) */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Encrpytion', val: 'AES-256', active: bootStep > 0 },
                        { label: 'Security', val: 'L3 ACTIVE', active: bootStep > 1 },
                        { label: 'Database', val: 'SYNCED', active: bootStep > 2 }
                    ].map((stat, i) => (
                        <div key={i} className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col items-center gap-1.5 ${stat.active ? 'border-seedlink-green/20 bg-seedlink-green/5' : 'border-white/5 bg-transparent opacity-20'}`}>
                            <div className="text-[8px] font-black text-slate-grey uppercase tracking-widest leading-none">{stat.label}</div>
                            <div className={`text-[10px] font-black italic tracking-tighter leading-none ${stat.active ? 'text-seedlink-green' : 'text-white'}`}>{stat.val}</div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center flex-col items-center gap-4 text-center mt-8">
                    <p className="text-[10px] font-bold text-slate-grey uppercase tracking-[0.2em] opacity-40">Unauthorized access attempt will be logged.</p>
                    <div className="flex items-center gap-1 text-seedlink-green/40 hover:text-seedlink-green transition-colors cursor-pointer group">
                        <Fingerprint size={12} className="group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Biometric Backup</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
