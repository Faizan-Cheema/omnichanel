"use client";

import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    MessageCircle,
    Phone,
    Globe,
    CheckCircle2,
    Clock,
    ChevronRight,
    Send,
    User,
    ShoppingBag,
    Zap,
    ArrowUpRight,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import DispositionModal from '@/components/modals/DispositionModal';
import { useToast } from '@/components/ToastProvider';

const InboxPage = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('All');
    const [isAIActive, setIsAIActive] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [activeThread, setActiveThread] = useState(0);
    const [messageInput, setMessageInput] = useState('');
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [isDrafting, setIsDrafting] = useState(false);

    const templates = [
        { cmd: "/status", label: "Order Status Update", text: "Hi, I've checked your order #5432 and it is currently being processed." },
        { cmd: "/agronomy", label: "Agronomy Support", text: "A specialist from our GROW unit will contact you regarding your soil sample." },
        { cmd: "/refund", label: "Refund Policy", text: "Our policy requires a human agent to verify refund requests. I am looking into this now." },
    ];

    const tabs = ['All', 'WhatsApp', 'Calls', 'Web Chat'];

    const threads = [
        { id: 0, name: "Ahmed Khan", channel: "WhatsApp", snippet: "I need to track my order #5432", context: "SOW", chip: "Order Status", status: "New", priority: "High", sla: "02:14" },
        { id: 1, name: "+92 300 1234567", channel: "Calls", snippet: "Missed call from customer", context: "GROW", chip: "Product Enquiry", status: "Missed", priority: "Low", sla: "15:00" },
        { id: 2, name: "Sarah Johnson", channel: "Web Chat", snippet: "Can I change my delivery address?", context: "CONNECT", chip: "Agronomy", status: "In Progress", priority: "Medium", sla: "45:00" }
    ];

    const currentThread = threads[activeThread];

    const handleClose = (disposition: string) => {
        console.log("Closing with disposition:", disposition);
        showToast('success', `Conversation closed with disposition: ${disposition}`);
        setIsClosing(false);
    };

    return (
        <div className="flex flex-col h-screen bg-soft-bg relative">
            <header className="px-6 pt-6 pb-4 bg-white border-b border-black/5 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-black text-charcoal tracking-tight">Unified Inbox</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative group w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey group-focus-within:text-seedlink-green transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search customer, order, or product..."
                                className="w-full pl-10 pr-4 py-2 bg-soft-bg border-transparent focus:bg-white focus:border-seedlink-green/20 focus:ring-4 focus:ring-seedlink-green/5 rounded-xl text-sm transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex p-1 bg-soft-bg rounded-xl gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-charcoal shadow-sm' : 'text-slate-grey hover:text-charcoal'}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black/5 rounded-lg text-xs font-bold text-slate-grey">
                            <span>Unit:</span>
                            <button className="text-charcoal hover:underline">All</button>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black/5 rounded-lg text-xs font-bold text-slate-grey">
                            <span>Status:</span>
                            <button className="text-charcoal hover:underline">New / In Progress</button>
                        </div>
                        <button className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-black/5 hover:scale-105 transition-transform active:scale-95">
                            <Filter size={14} /> <span>Advanced Filters</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Thread List */}
                <div className="w-[380px] border-r border-black/5 overflow-y-auto bg-white/50 backdrop-blur-sm">
                    {threads.map((thread, index) => (
                        <ThreadListItem
                            key={thread.id}
                            name={thread.name}
                            channel={thread.channel}
                            snippet={thread.snippet}
                            time={index === 0 ? "2m" : index === 1 ? "15m" : "1h"}
                            unit={thread.context}
                            status={thread.status}
                            priority={thread.priority}
                            aiChip={thread.chip}
                            sla={thread.sla}
                            active={activeThread === index}
                            onClick={() => setActiveThread(index)}
                        />
                    ))}
                </div>

                {/* Active Workspace */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    <div className="px-6 py-4 border-b border-black/5 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-soft-bg flex items-center justify-center text-lg font-black text-charcoal shadow-inner">{currentThread.name.substring(0, 2).toUpperCase()}</div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-charcoal tracking-tight">{currentThread.name}</h2>
                                    {currentThread.priority === 'High' && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-error/10 border border-error/20 text-error text-[10px] font-bold uppercase tracking-wider animate-pulse uppercase">
                                            <AlertCircle size={10} /> SLA Critical
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-grey">
                                    <MessageCircle size={12} className="text-seedlink-green" /> <span>{currentThread.channel} Business</span>
                                    <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                    <span className="text-error font-black uppercase tracking-tighter">{(currentThread as any).sla} to breach</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex p-1 bg-soft-bg rounded-xl border border-black/5">
                                {isAIActive ? (
                                    <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-seedlink-green shadow-sm flex items-center gap-2" onClick={() => { setIsAIActive(false); showToast('info', 'You have taken over from AI Assistant'); }}>
                                        <Zap size={14} /> AI Assistant
                                    </button>
                                ) : (
                                    <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-seedlink-green text-white shadow-sm flex items-center gap-2 translate-x-0" onClick={() => { setIsAIActive(true); showToast('ai', 'AI Assistant is now handling this conversation'); }}>
                                        <User size={14} /> Human Active
                                    </button>
                                )}
                            </div>
                            <div className="w-px h-6 bg-black/5 mx-2"></div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-grey hover:bg-soft-bg transition-colors" onClick={() => showToast('info', 'Conversation assigned to SOW team')}>Assign</button>
                                <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-grey hover:bg-soft-bg transition-colors" onClick={() => showToast('info', 'Conversation escalated to supervisor')}>Escalate</button>
                                <button className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-black/10" onClick={() => setIsClosing(true)}>Close</button>
                            </div>
                            <button className="p-2 hover:bg-soft-bg rounded-lg text-slate-grey transition-colors"><MoreHorizontal size={18} /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col scroll-smooth">
                        <div className="flex items-center justify-center">
                            <span className="px-4 py-1 bg-soft-bg text-[10px] font-bold text-slate-grey uppercase tracking-widest rounded-full">Yesterday</span>
                        </div>

                        <div className="flex flex-col gap-1 items-start max-w-[80%]">
                            <div className="px-4 py-3 bg-soft-bg rounded-2xl rounded-tl-none text-sm text-charcoal font-medium leading-relaxed shadow-sm">
                                Hello, I wanted to inquire about the latest seeds for the SOW project.
                            </div>
                            <span className="text-[10px] font-bold text-slate-grey ml-1">10:30 AM</span>
                        </div>

                        <div className="flex flex-col gap-1 items-end self-end max-w-[80%]">
                            <div className="px-4 py-3 bg-seedlink-green text-white rounded-2xl rounded-tr-none text-sm font-medium leading-relaxed shadow-md shadow-seedlink-green/20">
                                Welcome to Seedlink! An AI assistant is currently helping you.
                                One moment while I fetch the product catalog for SOW.
                            </div>
                            <span className="text-[10px] font-bold text-slate-grey mr-1">10:31 AM • AI Assistant</span>
                        </div>

                        <div className="flex items-center justify-center">
                            <span className="px-4 py-1 bg-soft-bg text-[10px] font-bold text-slate-grey uppercase tracking-widest rounded-full">Today</span>
                        </div>

                        <div className="flex flex-col gap-1 items-start max-w-[80%]">
                            <div className="px-4 py-3 bg-soft-bg rounded-2xl rounded-tl-none text-sm text-charcoal font-medium leading-relaxed shadow-sm border border-black/5">
                                I need to track my order #5432. It was supposed to arrive today.
                            </div>
                            <span className="text-[10px] font-bold text-slate-grey ml-1 font-black">09:45 AM</span>
                        </div>
                    </div>

                    <div className="p-6 bg-white border-t border-black/5 space-y-4">
                        <div className="relative">
                            {showSlashMenu && (
                                <div className="absolute bottom-full left-0 w-80 mb-4 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 z-50">
                                    <div className="px-4 py-2 bg-soft-bg text-[10px] font-bold text-slate-grey uppercase tracking-widest border-b border-black/5">Quick Templates</div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {templates.map(t => (
                                            <button
                                                key={t.cmd}
                                                className="w-full px-4 py-3 text-left hover:bg-seedlink-green/5 flex flex-col gap-0.5 group transition-colors"
                                                onClick={() => {
                                                    setMessageInput(t.text);
                                                    setShowSlashMenu(false);
                                                }}
                                            >
                                                <strong className="text-sm font-black text-charcoal group-hover:text-seedlink-green">{t.cmd}</strong>
                                                <span className="text-xs text-slate-grey">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="relative group">
                                {isDrafting && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center px-4 z-10 rounded-xl">
                                        <div className="flex items-center gap-2 text-seedlink-green font-bold text-sm">
                                            <Zap size={14} className="animate-pulse" /> AI is drafting...
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Type a response or '/' for templates..."
                                    className="w-full pl-4 pr-24 py-4 bg-soft-bg border-transparent focus:bg-white focus:border-seedlink-green/20 focus:ring-8 focus:ring-seedlink-green/5 rounded-2xl text-sm transition-all outline-none"
                                    value={messageInput}
                                    onChange={(e) => {
                                        setMessageInput(e.target.value);
                                        if (e.target.value === '/') setShowSlashMenu(true);
                                        else setShowSlashMenu(false);
                                    }}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button
                                        className="p-2.5 text-seedlink-green hover:bg-seedlink-green/10 rounded-xl transition-all active:scale-90"
                                        onClick={() => {
                                            setIsDrafting(true);
                                            showToast('ai', 'AI is drafting a response...');
                                            setTimeout(() => {
                                                setMessageInput("I see you're asking about order #5432. It's currently unfulfilled but scheduled for delivery tomorrow.");
                                                setIsDrafting(false);
                                                showToast('success', 'AI draft ready for review');
                                            }, 1200);
                                        }}
                                    >
                                        <Zap size={18} />
                                    </button>
                                    <button 
                                        className="p-2.5 bg-charcoal text-white rounded-xl shadow-lg shadow-black/10 hover:bg-slate-800 transition-all active:scale-90"
                                        onClick={() => {
                                            if (messageInput.trim()) {
                                                showToast('success', 'Message sent successfully');
                                                setMessageInput('');
                                            }
                                        }}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 border border-black/5 rounded-lg text-[10px] font-bold text-slate-grey hover:bg-soft-bg hover:text-charcoal transition-all" onClick={() => setMessageInput("Can you please provide your order ID?")}>ORDER STATUS</button>
                            <button className="px-3 py-1.5 border border-black/5 rounded-lg text-[10px] font-bold text-slate-grey hover:bg-soft-bg hover:text-charcoal transition-all" onClick={() => setMessageInput("Here is the technical guide for your fertilizer.")}>PRODUCT LINK</button>
                            <button className="px-3 py-1.5 border border-black/5 rounded-lg text-[10px] font-bold text-slate-grey hover:bg-soft-bg hover:text-charcoal transition-all">ESCALATE</button>
                        </div>
                    </div>
                </div>

                {/* Context Panel */}
                <div className="w-[360px] border-l border-black/5 overflow-y-auto bg-soft-bg/50 backdrop-blur-sm p-6 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-grey uppercase tracking-widest">
                            <Zap size={14} className="text-seedlink-green" /> AI Insights
                        </div>
                        <div className="p-5 bg-white border border-black/5 rounded-2xl shadow-sm space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter">Detected Intent</label>
                                <div className="px-3 py-1.5 bg-blue-soft text-blue-accent rounded-lg text-xs font-bold inline-block border border-blue-accent/10">Order Inquiry</div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter flex justify-between items-center">
                                    Confidence <span>94%</span>
                                </label>
                                <div className="h-1.5 bg-soft-bg rounded-full overflow-hidden">
                                    <div className="h-full bg-seedlink-green rounded-full shadow-[0_0_8px_rgba(109,190,69,0.5)]" style={{ width: '94%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-2 bg-error/5 p-4 rounded-xl border border-error/10">
                                <label className="text-[10px] font-bold text-error uppercase tracking-tighter">Escalation Reason</label>
                                <p className="text-xs text-error/80 leading-relaxed font-semibold">AI identified "Immediate Refund" request - Policy requires human verification.</p>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-black/5">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={14} className="text-blue-accent animate-pulse" />
                                    <label className="text-[10px] font-bold text-blue-accent uppercase tracking-[0.2em]">Knowledge Discovery</label>
                                </div>
                                <div className="p-4 bg-blue-soft/50 border border-blue-accent/20 rounded-2xl space-y-3 relative overflow-hidden group/mining">
                                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-accent/5 rounded-full blur-2xl group-hover/mining:scale-150 transition-transform"></div>
                                    <div className="relative z-10">
                                        <div className="text-[11px] font-black text-charcoal leading-relaxed">
                                            Gap Detected: "Solar Pump Battery Life"
                                        </div>
                                        <p className="text-[10px] text-slate-grey mt-1 font-medium italic">
                                            Detected 8 similar queries today. No documentation found in current KB.
                                        </p>
                                        <button className="mt-3 w-full py-2 bg-blue-accent text-white text-[9px] font-black rounded-lg shadow-lg shadow-blue-accent/20 hover:scale-[1.02] active:scale-95 transition-all">
                                            CREATE KB ENTRY
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter">Suggested Actions</label>
                                <div className="flex flex-col gap-2">
                                    <button className="w-full text-left px-3 py-2 text-xs font-bold text-charcoal bg-soft-bg hover:bg-black/5 rounded-lg transition-colors border border-black/5">Check Shopify Status</button>
                                    <button className="w-full text-left px-3 py-2 text-xs font-bold text-charcoal bg-soft-bg hover:bg-black/5 rounded-lg transition-colors border border-black/5">Send Tracking WhatsApp</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-grey uppercase tracking-widest">
                            <ShoppingBag size={14} className="text-blue-accent" /> Shopify Context
                        </div>
                        <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm group/shopify">
                            <div className="p-5 border-b border-black/5 bg-white/50 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg font-black text-charcoal">#5432</span>
                                        <span className="px-2 py-1 bg-warning/10 text-warning text-[10px] font-bold uppercase tracking-wider rounded border border-warning/10">In Transit</span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-grey">PKR 4,500.00</div>
                                </div>
                                <button className="p-2 hover:bg-black hover:text-white rounded-lg transition-all text-slate-grey/40">
                                    <ArrowUpRight size={14} />
                                </button>
                            </div>

                            {/* Shipment Tracker */}
                            <div className="p-5 space-y-6 relative overflow-hidden">
                                <div className="absolute left-[31px] top-7 bottom-7 w-px bg-black/5"></div>

                                <div className="flex gap-4 relative">
                                    <div className="w-3 h-3 rounded-full bg-seedlink-green shrink-0 mt-1 relative z-10 shadow-[0_0_0_4px_rgba(109,190,69,0.1)]"></div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-charcoal">Order Placed</div>
                                        <div className="text-[10px] text-slate-grey font-black uppercase opacity-40">Jan 08, 10:20 AM</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 relative">
                                    <div className="w-3 h-3 rounded-full bg-seedlink-green shrink-0 mt-1 relative z-10 shadow-[0_0_0_4px_rgba(109,190,69,0.1)]"></div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-charcoal">Processed</div>
                                        <div className="text-[10px] text-slate-grey font-black uppercase opacity-40">Jan 08, 04:30 PM</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 relative group/node">
                                    <div className="w-3 h-3 rounded-full bg-blue-accent shrink-0 mt-1 relative z-10 animate-pulse shadow-[0_0_12px_rgba(14,165,233,0.4)]"></div>
                                    <div className="space-y-1 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="text-xs font-bold text-blue-accent">Out for Delivery</div>
                                            <button className="text-[9px] font-black text-blue-accent hover:underline hidden group-hover/node:block uppercase tracking-tighter">Edit Route</button>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-grey mt-0.5 opacity-80 uppercase tracking-tighter">Lahore Logistics Hub</div>
                                        <div className="text-[10px] text-slate-grey font-black uppercase opacity-40">Today, 08:00 AM</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 relative">
                                    <div className="w-3 h-3 rounded-full bg-black/5 shrink-0 mt-1 relative z-10"></div>
                                    <div className="space-y-1 flex-1">
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs font-bold text-slate-grey">Delivered</div>
                                            <button className="px-2 py-0.5 bg-black text-white text-[9px] font-black rounded opacity-0 group-hover/shopify:opacity-100 transition-opacity">FORCE ARRIVAL</button>
                                        </div>
                                        <div className="text-[10px] text-slate-grey opacity-50 font-black uppercase tracking-tighter">Expected Today</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-soft-bg/50 border-t border-black/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black text-slate-grey uppercase tracking-widest">Logistics Command</h4>
                                    <div className="w-1.5 h-1.5 rounded-full bg-seedlink-green shadow-[0_0_4px_#6DBE45]"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="px-3 py-2.5 bg-white border border-black/5 rounded-xl text-[10px] font-black text-charcoal shadow-sm hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                                        UPDATE STATUS
                                    </button>
                                    <button className="px-3 py-2.5 bg-white border border-black/5 rounded-xl text-[10px] font-black text-error shadow-sm hover:bg-error hover:text-white transition-all flex items-center justify-center gap-2">
                                        ISSUE REFUND
                                    </button>
                                    <button className="px-3 py-2.5 bg-charcoal text-white rounded-xl text-[10px] font-black shadow-lg shadow-black/10 hover:shadow-black/20 transition-all flex items-center justify-center gap-2 col-span-2">
                                        TRIGGER LOGISTICS RESHIP
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 border-t border-black/5 bg-white/50 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-grey uppercase tracking-widest">Order Items (2)</h4>
                                <div className="space-y-3">
                                    <div className="flex gap-3 relative group/item">
                                        <div className="w-10 h-10 rounded-lg bg-soft-bg flex items-center justify-center shadow-sm text-lg group-hover/item:scale-110 transition-transform cursor-pointer">🌾</div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-xs font-black text-charcoal truncate">Wheat Seed Selection X5</span>
                                            <span className="text-[10px] font-black text-slate-grey opacity-40 uppercase tracking-tighter">QTY: 1 • PKR 3,200</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 relative group/item">
                                        <div className="w-10 h-10 rounded-lg bg-soft-bg flex items-center justify-center shadow-sm text-lg group-hover/item:scale-110 transition-transform cursor-pointer">🧪</div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-xs font-black text-charcoal truncate">Organic Booster B12</span>
                                            <span className="text-[10px] font-black text-slate-grey opacity-40 uppercase tracking-tighter">QTY: 1 • PKR 1,300</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-grey uppercase tracking-widest">
                            <User size={14} /> Customer Profile
                        </div>
                        <div className="p-5 bg-white border border-black/5 rounded-2xl shadow-sm space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter">Phone</label>
                                    <div className="text-xs font-bold text-charcoal">+92 300 9876543</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter">Location</label>
                                    <div className="text-xs font-bold text-charcoal">Lahore, PK</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter">Engagement Units</label>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-seedlink-green/5 text-seedlink-green border border-seedlink-green/10 rounded-lg text-[10px] font-black tracking-widest uppercase">SOW</span>
                                    <span className="px-2 py-1 bg-blue-soft text-blue-accent border border-blue-accent/10 rounded-lg text-[10px] font-black tracking-widest uppercase">GROW</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter">Last Products</label>
                                <div className="flex flex-col gap-1.5 font-bold">
                                    <span className="text-[11px] text-charcoal hover:underline cursor-pointer">Organic Fertilizer B1</span>
                                    <span className="text-[11px] text-charcoal hover:underline cursor-pointer">Wheat Seed X5</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <DispositionModal
                isOpen={isClosing}
                onClose={() => setIsClosing(false)}
                onConfirm={handleClose}
            />
        </div >
    );
};

interface ThreadListItemProps {
    name: string;
    channel: string;
    snippet: string;
    time: string;
    unit: string;
    status: string;
    priority: string;
    aiChip?: string;
    active: boolean;
    onClick: () => void;
    sla?: string;
}

const ThreadListItem = ({ name, channel, snippet, time, unit, status, priority, aiChip, active = false, onClick, sla }: ThreadListItemProps) => {
    const getIcon = () => {
        switch (channel) {
            case 'WhatsApp': return <MessageCircle size={14} className="text-seedlink-green" />;
            case 'Calls': return <Phone size={14} className="text-blue-accent" />;
            default: return <Globe size={14} className="text-slate-grey" />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'New': return 'bg-blue-accent';
            case 'Missed': return 'bg-error';
            case 'In Progress': return 'bg-warning';
            default: return 'bg-slate-grey';
        }
    };

    return (
        <div
            className={`px-6 py-5 border-b border-black/5 cursor-pointer transition-all relative group
                ${active ? 'bg-white shadow-xl shadow-black/5 z-10' : 'hover:bg-black/5'}
            `}
            onClick={onClick}
        >
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-seedlink-green" />}

            <div className="space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`text-sm font-black truncate ${active ? 'text-charcoal' : 'text-slate-grey group-hover:text-charcoal'}`}>{name}</span>
                        {aiChip && (
                            <span className="px-2 py-0.5 bg-seedlink-green/10 text-seedlink-green text-[9px] font-black uppercase tracking-wider rounded-full border border-seedlink-green/10">
                                {aiChip}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-grey shrink-0">{time}</span>
                </div>

                <p className={`text-xs line-clamp-1 leading-relaxed ${active ? 'text-slate-grey font-medium' : 'text-slate-grey opacity-60'}`}>
                    {snippet}
                </p>

                <div className="flex items-center justify-between mt-3 pt-1">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-soft-bg rounded-lg group-hover:bg-white transition-colors border border-transparent group-hover:border-black/5">
                            {getIcon()}
                            <span className="text-[9px] font-black text-slate-grey uppercase tracking-widest">{channel}</span>
                        </div>
                        <div className="px-2 py-1 bg-soft-bg rounded-lg border border-transparent group-hover:border-black/5 group-hover:bg-white transition-colors">
                            <span className="text-[9px] font-black text-slate-grey uppercase tracking-widest opacity-60">{unit}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {sla && priority === 'High' && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-error/5 text-error text-[10px] font-black rounded-md border border-error/10">
                                <Clock size={10} />
                                <span>{sla}</span>
                            </div>
                        )}
                        <div className={`w-2 h-2 rounded-full ${getStatusColor()} shadow-sm`}></div>
                    </div>
                </div>
            </div>

            <ChevronRight
                size={16}
                className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all ${active ? 'opacity-100 translate-x-0 text-seedlink-green' : 'opacity-0 -translate-x-2'}`}
            />
        </div>
    );
};

export default InboxPage;
