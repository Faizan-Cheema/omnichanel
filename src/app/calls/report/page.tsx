"use client";

import React from 'react';
import {
    Phone,
    Clock,
    Calendar,
    User,
    Smile,
    Frown,
    Meh,
    Zap,
    MessageCircle,
    ArrowLeft,
    Share2,
    Download,
    Play,
    Pause,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';

const CallReportPage = () => {
    const reportData = {
        customer: "Ahmed Khan",
        date: "Jan 09, 2026",
        duration: "08:24",
        status: "Resolved",
        sentimentScore: 78,
        intent: "Order Escalation"
    };

    const timelines = [
        { time: "0:00", sentiment: "neutral", text: "Call initiated - Greeting phase." },
        { time: "1:45", sentiment: "negative", text: "Customer expresses frustration regarding delivery delay.", marker: true },
        { time: "3:20", sentiment: "neutral", text: "Agent verifies order #5432 in Shopify." },
        { time: "5:10", sentiment: "positive", text: "Agent confirms priority reshipment - Sentiment shift.", marker: true },
        { time: "7:50", sentiment: "positive", text: "Call concluded - Customer satisfied with resolution." }
    ];

    return (
        <div className="p-10 space-y-10 bg-soft-bg min-h-screen">
            <header className="flex justify-between items-start">
                <div className="space-y-4">
                    <Link href="/calls" className="flex items-center gap-2 text-[10px] font-black text-slate-grey hover:text-charcoal transition-colors uppercase tracking-widest group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Workspace
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-charcoal tracking-tight">Interaction Analysis</h1>
                        <p className="text-slate-grey font-semibold mt-1 opacity-60">Reviewing call ID: SEC-4412-SOW</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 bg-white border border-black/5 rounded-2xl text-slate-grey hover:text-charcoal transition-all shadow-sm">
                        <Share2 size={20} />
                    </button>
                    <button className="p-3 bg-white border border-black/5 rounded-2xl text-slate-grey hover:text-charcoal transition-all shadow-sm">
                        <Download size={20} />
                    </button>
                    <button className="px-6 py-3 bg-charcoal text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all">
                        Sync to CRM
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Summary & Sentiment */}
                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-soft-bg flex items-center justify-center text-2xl font-black text-charcoal shadow-inner">AK</div>
                            <div>
                                <h2 className="text-xl font-black text-charcoal tracking-tight">{reportData.customer}</h2>
                                <div className="text-[10px] font-black text-slate-grey uppercase tracking-widest opacity-40">Loyalty level: SOW-PRO</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-soft-bg rounded-2xl space-y-1">
                                <div className="text-[9px] font-black text-slate-grey uppercase tracking-widest opacity-40">Duration</div>
                                <div className="text-lg font-black text-charcoal">{reportData.duration}</div>
                            </div>
                            <div className="p-5 bg-soft-bg rounded-2xl space-y-1">
                                <div className="text-[9px] font-black text-slate-grey uppercase tracking-widest opacity-40">Sentiment</div>
                                <div className="text-lg font-black text-seedlink-green">+{reportData.sentimentScore}</div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-charcoal text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-2 text-[10px] font-black text-seedlink-green uppercase tracking-[0.2em]">
                                <Zap size={14} /> AI Executive Summary
                            </div>
                            <p className="text-sm font-medium leading-relaxed opacity-80">
                                This interaction successfully resolved an order delay escalation. The agent utilized the "Priority Reship" protocol at 05:10, shifting customer sentiment from frustrated to satisfied. Recommended follow-up: Send tracking WhatsApp in 24 hours.
                            </p>
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">AI Intent Detection</div>
                                <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-seedlink-green border border-white/5 uppercase tracking-tighter italic">Order Escalation</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-seedlink-green/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                    </section>
                </div>

                {/* Right Column: Sentiment Timeline & Transcript */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl shadow-black/5 space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-charcoal tracking-tight italic flex items-center gap-3">
                                <BarChart3 size={20} className="text-seedlink-green" /> Sentiment Timeline
                            </h3>
                            <button className="flex items-center gap-2 px-4 py-2 bg-soft-bg rounded-xl text-[10px] font-black text-slate-grey hover:bg-black/5 transition-all uppercase tracking-widest">
                                <Play size={12} fill="currentColor" /> Preview Audio
                            </button>
                        </div>

                        {/* Interactive Graph Area */}
                        <div className="relative h-48 w-full group/graph">
                            <div className="absolute inset-x-0 top-1/2 h-px bg-black/5 border-dashed border-t"></div>

                            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 100" preserveAspectRatio="none">
                                <path
                                    d="M0,50 Q100,60 200,80 T400,50 T600,20 T800,10"
                                    fill="none"
                                    stroke="#6DBE45"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_8px_rgba(109,190,69,0.3)] transition-all duration-1000"
                                />
                                {/* Key Moment Dots */}
                                <circle cx="200" cy="80" r="6" fill="#EF4444" className="animate-pulse" />
                                <circle cx="450" cy="45" r="6" fill="#0EA5E9" />
                                <circle cx="700" cy="15" r="6" fill="#6DBE45" />
                            </svg>

                            <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 text-[9px] font-black text-slate-grey opacity-40 uppercase tracking-widest">
                                <span>0m</span>
                                <span>4m</span>
                                <span>8m</span>
                            </div>
                        </div>

                        {/* Transcript with Markers */}
                        <div className="space-y-6 pt-6 border-t border-black/5">
                            <div className="text-[10px] font-black text-slate-grey uppercase tracking-widest opacity-40 flex items-center gap-2">
                                <MessageCircle size={14} /> Interaction Transcript
                            </div>

                            <div className="space-y-4">
                                {timelines.map((item, i) => (
                                    <div key={i} className={`flex gap-6 p-4 rounded-3xl transition-all cursor-default ${item.marker ? 'bg-soft-bg border border-black/5 shadow-sm' : 'hover:bg-soft-bg/50'}`}>
                                        <div className="text-xs font-black text-slate-grey opacity-40 w-10 shrink-0">{item.time}</div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                                {item.sentiment === 'positive' && <Smile size={14} className="text-seedlink-green" />}
                                                {item.sentiment === 'negative' && <Frown size={14} className="text-error" />}
                                                {item.sentiment === 'neutral' && <Meh size={14} className="text-slate-grey" />}
                                                <span className={item.sentiment === 'positive' ? 'text-seedlink-green' : item.sentiment === 'negative' ? 'text-error' : 'text-slate-grey'}>
                                                    {item.sentiment}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-charcoal leading-relaxed">{item.text}</p>
                                        </div>
                                        {item.marker && (
                                            <div className="px-3 py-1 bg-charcoal text-white text-[9px] font-black rounded-lg uppercase tracking-tighter h-fit">KEY MOMENT</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CallReportPage;
