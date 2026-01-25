"use client";

import React, { useState, useEffect, useRef } from 'react';
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
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [isDrafting, setIsDrafting] = useState(false);
    const [whatsappThreads, setWhatsappThreads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeMessages, setActiveMessages] = useState<any[]>([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages]);

    useEffect(() => {
        const fetchWhatsAppThreads = async (silent = false) => {
            if (!silent) setIsLoading(true);
            try {
                const response = await fetch('https://caiphas-dev-n8n.syvyo.com/webhook/whatsapp/api');
                const data = await response.json();

                // Map API data to our thread format
                const mappedThreads = data.map((item: any) => ({
                    id: item.id,
                    name: item.name || item.phone_number,
                    channel: "WhatsApp",
                    snippet: item.last_message_preview,
                    context: "Direct",
                    chip: item.automate_response ? "AI Active" : "Manual",
                    status: "New",
                    priority: "Medium",
                    sla: "2h", // Default SLA
                    timestamp: new Date(item.last_message_timestamp),
                    phone_number: item.phone_number
                }));

                setWhatsappThreads(prev => {
                    const newThreads = [...mappedThreads];
                    // Smart merge
                    const merged = newThreads.map(nt => {
                        const existing = prev.find(p => p.phone_number === nt.phone_number);
                        if (existing && existing.timestamp.getTime() > nt.timestamp.getTime()) {
                            return { ...nt, timestamp: existing.timestamp, snippet: existing.snippet };
                        }
                        return nt;
                    });

                    // Sort by timestamp descending so newest is always first
                    return merged.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                });
            } catch (error) {
                console.error('Error fetching WhatsApp threads:', error);
                if (!silent) showToast('error', 'Failed to fetch WhatsApp threads');
            } finally {
                if (!silent) setIsLoading(false);
            }
        };

        fetchWhatsAppThreads();

        const pollInterval = setInterval(() => {
            fetchWhatsAppThreads(true);
        }, 10000);

        return () => clearInterval(pollInterval);
    }, []);

    // Effect for INITIAL thread selection only
    useEffect(() => {
        if (!activeThreadId && whatsappThreads.length > 0) {
            setActiveThreadId(whatsappThreads[0].phone_number);
        }
    }, [whatsappThreads, activeThreadId]);

    const threads = whatsappThreads.filter(t =>
        activeTab === 'All' || t.channel === activeTab
    );

    const currentThread = activeThreadId
        ? whatsappThreads.find(t => t.phone_number === activeThreadId) || null
        : (threads.length > 0 ? threads[0] : null);

    const templates = [
        { cmd: "/status", label: "Order Status Update", text: "Hi, I've checked your order #5432 and it is currently being processed." },
        { cmd: "/agronomy", label: "Agronomy Support", text: "A specialist from our GROW unit will contact you regarding your soil sample." },
        { cmd: "/refund", label: "Refund Policy", text: "Our policy requires a human agent to verify refund requests. I am looking into this now." },
    ];

    const tabs = ['All', 'WhatsApp', 'Calls', 'Web Chat'];

    useEffect(() => {
        const fetchMessages = async (silent = false) => {
            if (!currentThread || !currentThread.phone_number) return;

            if (!silent) setIsMessagesLoading(true);
            try {
                const response = await fetch(`https://caiphas-dev-n8n.syvyo.com/webhook/whatsapp/api?conversation_id=${currentThread.phone_number}`);
                const data = await response.json();
                setActiveMessages(data);

                // Update the thread list snippet and timestamp if it's newer
                if (data.length > 0) {
                    const latestMsg = data[data.length - 1];
                    setWhatsappThreads(prev => prev.map(t =>
                        t.phone_number === currentThread.phone_number
                            ? { ...t, snippet: latestMsg.text, timestamp: new Date(latestMsg.timestamp) }
                            : t
                    ));
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                if (!silent && activeMessages.length === 0) setIsMessagesLoading(false); // Only hide spinner if it was shown
            }
        };

        fetchMessages();

        const pollInterval = setInterval(() => {
            fetchMessages(true);
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [activeThreadId]); // Only re-run when the person changes, not when their status updates

    // Separate effect for AI status synchronization to avoid flickering
    useEffect(() => {
        if (currentThread) {
            setIsAIActive(currentThread.chip === "AI Active");
        }
    }, [currentThread?.chip]);

    const formatTime = (date: Date) => {
        if (isNaN(date.getTime())) return "";
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m`;

        const isToday = date.toDateString() === now.toDateString();
        const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (isYesterday) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const handleClose = (disposition: string) => {
        console.log("Closing with disposition:", disposition);
        showToast('success', `Conversation closed with disposition: ${disposition}`);
        setIsClosing(false);
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !currentThread) return;

        const text = messageInput.trim();
        setMessageInput('');

        // If it's a WhatsApp thread, use the POST API
        if (currentThread.channel === 'WhatsApp' && currentThread.phone_number) {
            setIsSending(true);
            const newMessage = {
                message_id: `wamid.OUTBOUND${Date.now()}`,
                from: "15551900251", // Configurable or from context
                to: currentThread.phone_number,
                direction: "outbound",
                text: text,
                timestamp: new Date().toISOString(),
                status: "sent",
                conversation_id: currentThread.phone_number
            };

            try {
                // Optimistically update UI
                setActiveMessages(prev => [...prev, { ...newMessage, id: Date.now() }]);

                const response = await fetch('https://caiphas-dev-n8n.syvyo.com/webhook/whatsapp/api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newMessage)
                });

                if (!response.ok) throw new Error('Failed to send message');
                showToast('success', 'Message sent successfully');
            } catch (error) {
                console.error('Error sending message:', error);
                showToast('error', 'Failed to send message. Please try again.');
                // Rollback optimistic update if needed or show error state
            } finally {
                setIsSending(false);
            }
        } else {
            // Handle other channels or mock
            showToast('success', 'Message sent (Mock)');
        }
    };

    const handleToggleAI = async (active: boolean) => {
        if (!currentThread || !currentThread.phone_number) return;

        setIsAIActive(active); // Optimistic update
        try {
            const response = await fetch('https://caiphas-dev-n8n.syvyo.com/webhook/whatsapp/api', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversation_id: currentThread.phone_number,
                    automated_response: active
                })
            });

            if (!response.ok) throw new Error('Failed to update AI status');

            showToast(active ? 'ai' : 'info',
                active ? 'AI Assistant is now handling this conversation' : 'You have taken over from AI Assistant'
            );
        } catch (error) {
            console.error('Error toggling AI:', error);
            setIsAIActive(!active); // Rollback
            showToast('error', 'Failed to update assistant status');
        }
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
                    {isLoading && threads.length === 0 ? (
                        <div className="p-8 text-center text-slate-grey text-sm font-bold">
                            <div className="animate-spin mb-2 flex justify-center">
                                <Clock size={20} />
                            </div>
                            Loading conversations...
                        </div>
                    ) : threads.map((thread, index) => (
                        <ThreadListItem
                            key={thread.id}
                            name={thread.name}
                            channel={thread.channel}
                            snippet={thread.snippet}
                            time={thread.timestamp ? formatTime(thread.timestamp) : (thread.time || "")}
                            unit={thread.context}
                            status={thread.status}
                            priority={thread.priority}
                            aiChip={thread.chip}
                            sla={thread.sla}
                            active={currentThread?.phone_number === thread.phone_number}
                            onClick={() => setActiveThreadId(thread.phone_number)}
                        />
                    ))}
                </div>

                {/* Active Workspace */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    <div className="px-6 py-4 border-b border-black/5 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-soft-bg flex items-center justify-center text-lg font-black text-charcoal shadow-inner">
                                {currentThread ? currentThread.name.substring(0, 2).toUpperCase() : '??'}
                            </div>
                            {currentThread && (
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-charcoal tracking-tight">{currentThread.name}</h2>
                                        {currentThread.priority === 'High' && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-error/10 border border-error/20 text-error text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                                <AlertCircle size={10} /> SLA Critical
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-grey">
                                        <MessageCircle size={12} className="text-seedlink-green" /> <span>{currentThread.channel} Business</span>
                                        <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                        <span className="text-error font-black uppercase tracking-tighter">{currentThread.sla} to breach</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex p-1 bg-soft-bg rounded-xl border border-black/5">
                                {isAIActive ? (
                                    <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-seedlink-green shadow-sm flex items-center gap-2" onClick={() => handleToggleAI(false)}>
                                        <Zap size={14} /> AI Assistant
                                    </button>
                                ) : (
                                    <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-seedlink-green text-white shadow-sm flex items-center gap-2 translate-x-0" onClick={() => handleToggleAI(true)}>
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
                        {!currentThread ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-grey gap-4">
                                <MessageCircle size={48} className="opacity-20" />
                                <p className="font-bold text-sm">Select a conversation to start chatting</p>
                            </div>
                        ) : (isMessagesLoading && activeMessages.length === 0) ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-grey gap-4">
                                <div className="animate-spin">
                                    <Clock size={32} />
                                </div>
                                <p className="font-bold text-sm">Loading messages...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center">
                                    <span className="px-4 py-1 bg-soft-bg text-[10px] font-bold text-slate-grey uppercase tracking-widest rounded-full">Conversation Started</span>
                                </div>

                                {activeMessages.length > 0 ? (
                                    activeMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col gap-1 max-w-[80%] ${msg.direction === 'outbound' ? 'items-end self-end' : 'items-start'}`}
                                        >
                                            <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.direction === 'outbound'
                                                ? 'bg-seedlink-green text-white rounded-tr-none shadow-md shadow-seedlink-green/20'
                                                : 'bg-soft-bg text-charcoal rounded-tl-none border border-black/5'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-grey mx-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {msg.direction === 'outbound' && ' • Sent'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col gap-1 items-start max-w-[80%]">
                                        <div className="px-4 py-3 bg-soft-bg rounded-2xl rounded-tl-none text-sm text-charcoal font-medium leading-relaxed shadow-sm border border-black/5">
                                            {currentThread.snippet}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-grey ml-1 font-black">
                                            {currentThread.timestamp ? currentThread.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </span>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
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
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
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
                                        className={`p-2.5 bg-charcoal text-white rounded-xl shadow-lg shadow-black/10 hover:bg-slate-800 transition-all active:scale-90 ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleSendMessage}
                                        disabled={isSending}
                                    >
                                        <Send size={18} className={isSending ? 'animate-pulse' : ''} />
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
                                    <div className="text-xs font-bold text-charcoal">{currentThread?.phone_number || "+92 300 9876543"}</div>
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
