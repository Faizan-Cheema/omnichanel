"use client";

import React from 'react';
import {
    Users,
    Zap,
    AlertCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    MessageSquare,
    Phone,
    Globe
} from 'lucide-react';

const SupervisorPage = () => {
    const kpis = [
        { label: "Active Queue", value: "48", delta: "+12%", trend: "up", icon: Users, color: "text-blue-accent" },
        { label: "AI Handled", value: "89%", delta: "+4%", trend: "up", icon: Zap, color: "text-seedlink-green" },
        { label: "Escalations", value: "12", delta: "-2%", trend: "down", icon: AlertCircle, color: "text-error" },
        { label: "Avg. SLA", value: "4m 12s", delta: "-18s", trend: "down", icon: Clock, color: "text-charcoal" },
    ];

    const escalations = [
        { id: 1, name: "Ahmed Khan", reason: "Immediate Refund Request", wait: "2m", unit: "SOW", channel: "WhatsApp" },
        { id: 2, name: "Saqib Pervez", reason: "Angry Sentiment Detected", wait: "5m", unit: "GROW", channel: "WhatsApp" },
        { id: 3, name: "Maria Garcia", reason: "Complex Technical Query", wait: "12m", unit: "CONNECT", channel: "Calls" },
    ];

    return (
        <div className="p-10 space-y-12 bg-soft-bg min-h-screen">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-charcoal tracking-tight">Supervisor Dashboard</h1>
                    <p className="text-slate-grey font-semibold mt-1 opacity-60">Real-time operational overview for Seedlink Omnichannel.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-2 bg-white rounded-xl text-xs font-black border border-black/5 shadow-sm text-charcoal">LIVE UPDATE</span>
                    <div className="px-4 py-2 bg-seedlink-green text-white rounded-xl text-xs font-black shadow-lg shadow-seedlink-green/20 animate-pulse">SYSTEM ACTIVE</div>
                </div>
            </header>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-xl shadow-black/5 hover:scale-[1.02] transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-4 rounded-2xl bg-soft-bg group-hover:bg-white transition-colors ${kpi.color}`}>
                                <kpi.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] font-black italic ${kpi.trend === 'up' ? 'text-seedlink-green' : 'text-error'}`}>
                                {kpi.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {kpi.delta}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-charcoal tracking-tighter">{kpi.value}</div>
                            <div className="text-[11px] font-bold text-slate-grey uppercase tracking-widest opacity-40">{kpi.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Escalation Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <AlertCircle className="text-error" size={20} />
                        <h2 className="text-xl font-black text-charcoal tracking-tight">Active Intervention Queue</h2>
                    </div>

                    <div className="space-y-3">
                        {escalations.map((esc) => (
                            <div key={esc.id} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-xl transition-all flex justify-between items-center group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-soft-bg flex items-center justify-center text-lg font-black text-charcoal shadow-inner">{esc.name.substring(0, 2).toUpperCase()}</div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-md font-black text-charcoal">{esc.name}</span>
                                            <span className="px-2 py-0.5 bg-error/5 text-error text-[9px] font-black rounded border border-error/10 uppercase tracking-widest">{esc.reason}</span>
                                        </div>
                                        <div className="text-xs font-bold text-slate-grey flex items-center gap-2 opacity-60">
                                            {esc.channel === 'WhatsApp' ? <MessageSquare size={12} /> : <Phone size={12} />}
                                            {esc.channel}
                                            <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                            {esc.unit} Unit
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-[9px] font-black text-slate-grey uppercase tracking-widest opacity-40 mb-1">Waiting</div>
                                        <div className="text-sm font-black text-error animate-pulse italic">{esc.wait}</div>
                                    </div>
                                    <button className="bg-charcoal text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                        Intervene <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Stats / Channel Volume */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <TrendingUp className="text-seedlink-green" size={20} />
                        <h2 className="text-xl font-black text-charcoal tracking-tight">Live Volume</h2>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-8">
                        {[
                            { label: "WhatsApp Traffic", value: 65, color: "bg-seedlink-green" },
                            { label: "Direct Calls", value: 42, color: "bg-blue-accent" },
                            { label: "Web Chatbot", value: 28, color: "bg-charcoal" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-slate-grey uppercase tracking-widest">{stat.label}</span>
                                    <span className="text-lg font-black text-charcoal">{stat.value}%</span>
                                </div>
                                <div className="h-3 bg-soft-bg rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full rounded-full ${stat.color} shadow-lg transition-all duration-1000 ease-out`}
                                        style={{ width: `${stat.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-6 border-t border-black/5 flex flex-col items-center gap-4">
                            <div className="text-[10px] font-black text-slate-grey uppercase tracking-widest opacity-40">System Efficiency</div>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="12" className="text-soft-bg" />
                                    <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="351.85" strokeDashoffset="31.85" className="text-seedlink-green drop-shadow-[0_0_8px_rgba(109,190,69,0.4)]" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-charcoal">92%</span>
                                    <span className="text-[8px] font-black text-seedlink-green uppercase">Optimal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Intent Drift Analysis Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <Zap className="text-seedlink-green" size={20} />
                        <h2 className="text-xl font-black text-charcoal tracking-tight">Intent Drift Analysis</h2>
                    </div>
                    <div className="text-[10px] font-black text-slate-grey opacity-40 uppercase tracking-[0.2em]">Weekly Shift: +12.4%</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            label: "Order Tracking",
                            drift: "-4%",
                            status: "Stable",
                            color: "text-seedlink-green",
                            points: "20,60 40,58 60,62 80,60 100,61"
                        },
                        {
                            label: "Refund Requests",
                            drift: "+18%",
                            status: "Rising",
                            color: "text-error",
                            points: "20,60 40,52 60,45 80,38 100,30"
                        },
                        {
                            label: "Technical Support",
                            drift: "+32%",
                            status: "Critical Drift",
                            color: "text-blue-accent",
                            points: "20,60 40,65 60,62 80,75 100,85"
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 hover:scale-[1.02] transition-all group overflow-hidden relative">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="text-sm font-black text-charcoal tracking-tight">{item.label}</div>
                                    <div className="text-[10px] font-bold text-slate-grey uppercase tracking-widest opacity-40 mt-1">Intent Category</div>
                                </div>
                                <div className={`text-xs font-black italic ${item.color}`}>{item.drift}</div>
                            </div>

                            <div className="h-20 mb-6 relative">
                                <svg className="w-full h-full" viewBox="0 0 120 100" preserveAspectRatio="none">
                                    <polyline
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={item.color}
                                        points={item.points}
                                    />
                                </svg>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-black/5">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${item.color} opacity-80`}>{item.status}</span>
                                <button className="text-[9px] font-black text-slate-grey hover:text-charcoal transition-all uppercase tracking-tighter">View Clusters</button>
                            </div>

                            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-5 ${item.color.replace('text-', 'bg-')}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SupervisorPage;
