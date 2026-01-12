"use client";

import React, { useState } from 'react';
import {
    Phone,
    PhoneOff,
    Mic,
    MicOff,
    MoreHorizontal,
    Video,
    Volume2,
    Zap,
    Send,
    MessageCircle,
    CheckCircle2,
    Clock,
    User,
    ArrowRight,
    Delete
} from 'lucide-react';

const CallsPage = () => {
    const [callStatus, setCallStatus] = useState<'idle' | 'active' | 'on-hold' | 'finished'>('idle');
    const [isMuted, setIsMuted] = useState(false);
    const [dialNumber, setDialNumber] = useState('');

    const toggleMute = () => setIsMuted(!isMuted);

    const handleKeyClick = (key: string) => {
        setDialNumber(prev => prev + key);
    };

    const handleCall = (number?: string) => {
        if (number) setDialNumber(number);
        setCallStatus('active');
    };

    const outreachTargets = [
        { id: 1, name: "Ahmed Khan", reason: "Failed Payment (#5432)", number: "+92 300 1234567" },
        { id: 2, name: "Maria Garcia", reason: "Order Delay Notice", number: "+34 600 987654" },
        { id: 3, name: "Chen Wei", reason: "High-Priority SOW Support", number: "+86 138 0000 0000" }
    ];

    return (
        <div className="flex flex-col h-screen bg-soft-bg">
            {/* Call Status Banner */}
            {callStatus !== 'idle' && (
                <div className={`px-8 py-6 flex justify-between items-center transition-all duration-500
                    ${callStatus === 'active' ? 'bg-charcoal' : callStatus === 'on-hold' ? 'bg-warning' : 'bg-slate-grey'}
                `}>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-full bg-seedlink-green flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(109,190,69,0.3)]">
                            <Phone size={24} className="text-white fill-white" />
                        </div>
                        <div className="text-white">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">
                                {callStatus === 'active' ? 'Live Connection' : callStatus === 'on-hold' ? 'Call on Hold' : 'Review Phase'}
                            </div>
                            <h2 className="text-xl font-black tracking-tight">{callStatus === 'finished' ? 'Ahmed Khan' : '+92 300 9876543'}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {callStatus !== 'finished' ? (
                            <>
                                <button className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 transition-colors ${isMuted ? 'bg-error text-white' : 'bg-white/10 text-white hover:bg-white/20'}`} onClick={toggleMute}>
                                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                                </button>
                                <button className="w-12 h-12 bg-white/10 text-white border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"><Volume2 size={20} /></button>
                                <button className="w-12 h-12 bg-white/10 text-white border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"><Video size={20} /></button>
                                <button className="px-6 h-12 bg-error text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-error/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2" onClick={() => setCallStatus('finished')}>
                                    <PhoneOff size={18} /> End Call
                                </button>
                            </>
                        ) : (
                            <button className="px-6 py-3 bg-white text-charcoal rounded-xl font-bold text-sm shadow-xl hover:bg-soft-bg transition-all active:scale-95" onClick={() => setCallStatus('idle')}>
                                New Call
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 p-8 flex gap-8 overflow-hidden">
                <main className="flex-1 bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 overflow-y-auto p-12 relative flex flex-col">
                    {callStatus === 'idle' ? (
                        <div className="flex flex-col items-center justify-center h-full gap-12 animate-in fade-in duration-500">
                            {/* Dialer Card */}
                            <div className="bg-white border border-black/5 rounded-[2rem] p-10 w-96 shadow-2xl shadow-black/5 space-y-8">
                                <div className="bg-soft-bg rounded-2xl p-6 flex items-center gap-3 border border-black/5 shadow-inner">
                                    <input
                                        type="text"
                                        value={dialNumber}
                                        readOnly
                                        placeholder="Enter number..."
                                        className="bg-transparent border-none outline-none text-2xl font-black text-charcoal w-full text-center tracking-widest placeholder:opacity-20"
                                    />
                                    {dialNumber && <button onClick={() => setDialNumber('')} className="text-slate-grey font-bold px-2">C</button>}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(key => (
                                        <button
                                            key={key}
                                            onClick={() => handleKeyClick(key)}
                                            className="w-full aspect-square rounded-2xl bg-soft-bg hover:bg-white border border-transparent hover:border-black/5 text-xl font-bold text-charcoal transition-all active:scale-90 hover:shadow-lg"
                                        >
                                            {key}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    className="w-full h-16 bg-seedlink-green text-white rounded-[1.25rem] shadow-xl shadow-seedlink-green/20 flex items-center justify-center gap-3 font-black text-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20"
                                    disabled={!dialNumber}
                                    onClick={() => handleCall()}
                                >
                                    <Phone size={24} className="fill-white" /> Dial Now
                                </button>
                            </div>

                            {/* Outreach Section */}
                            <div className="w-full max-w-xl space-y-6">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-grey uppercase tracking-[0.2em] px-4">
                                    <Zap size={14} className="text-seedlink-green" /> AI Recommended Outreach
                                </div>
                                <div className="grid gap-3">
                                    {outreachTargets.map(target => (
                                        <div key={target.id} className="bg-white p-5 rounded-3xl border border-black/5 flex justify-between items-center group hover:border-seedlink-green/30 hover:shadow-xl transition-all">
                                            <div>
                                                <div className="text-sm font-black text-charcoal group-hover:text-seedlink-green transition-colors">{target.name}</div>
                                                <div className="text-[11px] font-bold text-slate-grey opacity-60 mt-0.5 uppercase tracking-tighter">{target.reason}</div>
                                            </div>
                                            <button
                                                className="bg-soft-bg text-seedlink-green px-4 py-2 rounded-xl text-xs font-black shadow-sm group-hover:bg-seedlink-green group-hover:text-white transition-all flex items-center gap-2"
                                                onClick={() => handleCall(target.number)}
                                            >
                                                <Phone size={14} /> Call Target
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : callStatus === 'finished' ? (
                        <div className="flex flex-col h-full animate-in fade-in duration-500">
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-seedlink-green-soft flex items-center justify-center text-seedlink-green"><CheckCircle2 size={18} /></div>
                                    <h2 className="text-3xl font-black text-charcoal tracking-tight">Call Successful</h2>
                                </div>
                                <p className="text-slate-grey font-medium">Auto-generated follow-up draft based on interaction insights.</p>
                            </div>

                            <div className="bg-soft-bg rounded-[2rem] border border-black/5 overflow-hidden mb-12 flex flex-col shadow-inner">
                                <div className="px-8 py-4 bg-white border-b border-black/5 flex items-center gap-2 text-[10px] font-bold text-slate-grey uppercase tracking-widest">
                                    <MessageCircle size={14} /> WhatsApp Template Assistant
                                </div>
                                <div className="p-10 italic text-xl text-charcoal leading-relaxed font-medium">
                                    "Hi Ahmed, thank you for the call! I've manually prioritized your order #5432 and confirmed it's arriving by tomorrow 4 PM. We've also applied a 10% credit for the delay. Best, Seedlink Team."
                                </div>
                                <div className="px-8 py-6 border-t border-black/5 bg-white/50 flex justify-end gap-3">
                                    <button className="px-6 py-2.5 text-xs font-bold text-slate-grey hover:text-charcoal transition-colors">Discard Draft</button>
                                    <button className="px-8 py-2.5 bg-seedlink-green text-white rounded-xl text-xs font-black shadow-lg shadow-seedlink-green/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                        <Send size={14} /> Send Follow-up
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-grey uppercase tracking-widest px-4">Alternate Suggestions</h3>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-white border border-black/5 rounded-2xl text-xs font-bold text-charcoal hover:border-seedlink-green transition-all shadow-sm">Schedule Callback</button>
                                    <button className="px-6 py-3 bg-white border border-black/5 rounded-2xl text-xs font-bold text-charcoal hover:border-seedlink-green transition-all shadow-sm">Escalate to Logistics</button>
                                    <button className="px-6 py-3 bg-white border border-black/5 rounded-2xl text-xs font-bold text-charcoal hover:border-seedlink-green transition-all shadow-sm">Send Product Guide</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-grey uppercase tracking-[0.2em]">
                                <Zap size={16} className="text-seedlink-green" /> Live AI Insights
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-soft-bg p-8 rounded-[2rem] border border-black/5 shadow-inner space-y-4">
                                    <label className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter">Detected Intent</label>
                                    <div className="flex items-end justify-between">
                                        <div className="text-2xl font-black text-charcoal tracking-tight italic">Order Escalation</div>
                                        <span className="px-2 py-1 bg-seedlink-green/10 text-seedlink-green text-[10px] font-black rounded border border-seedlink-green/10 shadow-sm">98% CONFIDENCE</span>
                                    </div>
                                </div>
                                <div className="bg-soft-bg p-8 rounded-[2rem] border border-black/5 shadow-inner space-y-4">
                                    <label className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter">Customer Sentiment</label>
                                    <div className="flex items-end justify-between">
                                        <div className="text-2xl font-black text-charcoal tracking-tight italic text-error">Frustrated</div>
                                        <span className="px-2 py-1 bg-error/10 text-error text-[10px] font-black rounded border border-error/10 shadow-sm">STRESS DETECTED</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white border border-black/10 rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden group">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
                                        <div className="text-[10px] font-bold text-slate-grey uppercase tracking-[0.2em]">Real-time Transcript</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></div>
                                            <span className="text-[10px] font-black text-error uppercase">Listening</span>
                                        </div>
                                    </div>
                                    <div className="space-y-6 text-lg text-charcoal font-medium italic opacity-40">
                                        <p>“...I ordered the wheat seeds last week and they still haven’t arrived at my farm. My planting window is closing...”</p>
                                        <p className="opacity-100 text-seedlink-green font-black">AI Summary: Customer is anxious about delivery delay impacting seasonal planting.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-slate-grey uppercase tracking-[0.2em] px-4">Suggested Instant Actions</h3>
                                <div className="flex gap-4">
                                    <button className="flex items-center gap-3 bg-seedlink-green text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-seedlink-green/20 hover:scale-105 active:scale-95 transition-all">
                                        <MessageCircle size={20} /> Send WhatsApp Follow-up
                                    </button>
                                    <button className="flex items-center gap-3 bg-white border border-black/5 text-charcoal px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-soft-bg transition-all">
                                        <CheckCircle2 size={20} className="text-seedlink-green" /> Issue Store Credit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <aside className="w-96 space-y-8 overflow-y-auto pr-2">
                    <section className="bg-white border border-black/5 rounded-[2rem] p-8 shadow-xl shadow-black/5 space-y-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-grey uppercase tracking-widest">
                            <Clock size={16} /> Interaction History
                        </div>
                        <div className="space-y-6">
                            {[
                                { status: "DELIVERED", text: "SMS Notification: Order #5400 shipped.", icon: <CheckCircle2 size={14} /> },
                                { status: "INQUIRY", text: "WhatsApp: Customer inquired about soil pH kit.", icon: <MessageCircle size={14} /> },
                                { status: "LOGISTICS", text: "Internal: Driver assigned to SOW Region.", icon: <ArrowRight size={14} /> }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-8 h-8 rounded-lg bg-soft-bg flex items-center justify-center text-slate-grey shrink-0 group-hover:bg-seedlink-green-soft group-hover:text-seedlink-green transition-colors">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black text-slate-grey opacity-40 leading-none mb-1 uppercase tracking-tighter">{item.status}</div>
                                        <p className="text-xs font-bold text-charcoal leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-error/5 border border-error/10 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-error uppercase tracking-widest mb-4">
                            <AlertTriangle className="animate-pulse" size={16} /> Critical Alerts
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-error/5">
                            <div className="text-sm font-black text-error mb-2 uppercase tracking-tighter italic">Route Disruption</div>
                            <p className="text-xs text-error/80 leading-relaxed font-semibold">Multiple delivery delays reported in the central SOW farming corridor due to sudden localized storm.</p>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

const AlertTriangle = ({ size, className }: { size: number, className: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
);

export default CallsPage;
