"use client";

import React, { useState, useEffect } from 'react';
import {
    Search,
    User,
    ShoppingBag,
    Zap,
    Command,
    ArrowRight,
    MessageCircle
} from 'lucide-react';

const CommandMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Handle Ctrl+K / Cmd+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-md animate-in fade-in duration-300 flex items-start justify-center pt-[15vh]"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-black/5 overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-6 py-6 border-b border-black/5 flex items-center gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <Search size={22} className="text-seedlink-green" />
                    <input
                        autoFocus
                        placeholder="Search customers, orders, products or commands..."
                        className="flex-1 bg-transparent border-none outline-none text-lg font-black text-charcoal tracking-tight placeholder:text-slate-grey/30"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="px-2 py-1 bg-soft-bg rounded-lg text-[10px] font-black text-slate-grey border border-black/5 shadow-inner">ESC</div>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-8">
                    <section className="space-y-3">
                        <div className="px-4 text-[10px] font-black text-slate-grey uppercase tracking-[0.2em] opacity-40">Recent Customers</div>
                        <div className="space-y-1">
                            {[
                                { name: "Ahmed Khan", unit: "SOW", icon: User },
                                { name: "Sarah Johnson", unit: "CONNECT", icon: User }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-seedlink-green/5 rounded-2xl cursor-pointer group transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-soft-bg flex items-center justify-center text-slate-grey group-hover:bg-white group-hover:text-seedlink-green transition-all shadow-sm">
                                        <item.icon size={16} />
                                    </div>
                                    <span className="flex-1 text-sm font-black text-charcoal tracking-tight">{item.name}</span>
                                    <div className="px-2 py-0.5 bg-soft-bg text-slate-grey text-[9px] font-black rounded-md border border-black/5 uppercase tracking-widest">{item.unit}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <div className="px-4 text-[10px] font-black text-slate-grey uppercase tracking-[0.2em] opacity-40">Shopify Orders</div>
                        <div className="space-y-1">
                            {[
                                { name: "Order #5432 — PKR 4,500", detail: "Waiting for Shipment", icon: ShoppingBag },
                                { name: "Order #4412 — PKR 12,200", detail: "Delivered", icon: ShoppingBag }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-blue-soft text-charcoal rounded-2xl cursor-pointer group transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-soft-bg flex items-center justify-center text-slate-grey group-hover:bg-white group-hover:text-blue-accent transition-all shadow-sm">
                                        <item.icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black tracking-tight">{item.name}</div>
                                        <div className="text-[10px] font-bold text-slate-grey opacity-60 truncate">{item.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3 pb-4 border-b border-black/5">
                        <div className="px-4 text-[10px] font-black text-slate-grey uppercase tracking-[0.2em] opacity-40">Quick Actions</div>
                        <div className="space-y-1">
                            {[
                                { name: "Take over current AI thread", shortcut: "⌘ T", icon: Zap },
                                { name: "Send WhatsApp Template", shortcut: "⌘ W", icon: MessageCircle }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-charcoal hover:text-white rounded-2xl cursor-pointer group transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-soft-bg flex items-center justify-center text-slate-grey group-hover:bg-white/10 group-hover:text-white transition-all">
                                        <item.icon size={16} />
                                    </div>
                                    <span className="flex-1 text-sm font-black tracking-tight">{item.name}</span>
                                    <div className="px-2 py-1 bg-soft-bg text-slate-grey text-[10px] font-black rounded-lg group-hover:bg-white/10 group-hover:text-white/60 transition-all font-mono">{item.shortcut}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="px-6 py-4 bg-soft-bg/30 flex justify-between items-center text-[10px] font-black text-slate-grey uppercase tracking-widest border-t border-black/5">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><ArrowRight size={12} className="text-seedlink-green" /> to select</span>
                        <span className="flex items-center gap-1.5"><Command size={12} />K to toggle</span>
                    </div>
                    <span className="opacity-40 italic">Seedlink Omni Search</span>
                </div>
            </div>
        </div>
    );
};

export default CommandMenu;
