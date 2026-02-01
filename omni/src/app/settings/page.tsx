"use client";

import React, { useState } from 'react';
import {
    Shield,
    Clock,
    MapPin,
    Globe,
    Database,
    UserPlus,
    ArrowUpRight,
    DatabaseZap,
    CheckCircle2,
    RefreshCcw,
    Plus,
    FileText,
    UploadCloud,
    Trash2,
    Loader2,
    Sparkles,
    Lightbulb,
    ExternalLink,
    Workflow,
    ArrowRight,
    Search,
    MessageSquare,
    Zap,
    AlertTriangle
} from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('Routing');

    const settingMenus = [
        { id: 'General', icon: Globe },
        { id: 'Routing', icon: MapPin },
        { id: 'Business Hours', icon: Clock },
        { id: 'Teams', icon: UserPlus },
        { id: 'Security', icon: Shield },
        { id: 'Knowledge Base', icon: DatabaseZap },
    ];

    return (
        <div className="p-10 bg-soft-bg min-h-screen">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-charcoal tracking-tight">Settings</h1>
            </header>

            <div className="grid grid-cols-[280px_1fr] gap-12 bg-white rounded-[2.5rem] min-h-[75vh] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden">
                {/* Settings Sidebar */}
                <aside className="bg-soft-bg/50 border-r border-black/5 p-8 flex flex-col gap-2 relative">
                    {settingMenus.map((menu) => (
                        <button
                            key={menu.id}
                            className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all
                                ${activeTab === menu.id
                                    ? 'bg-white text-seedlink-green shadow-xl shadow-black/5 active:scale-95'
                                    : 'text-slate-grey hover:bg-white/50 hover:text-charcoal'
                                }`}
                            onClick={() => setActiveTab(menu.id)}
                        >
                            <menu.icon size={20} className={activeTab === menu.id ? 'text-seedlink-green' : 'text-slate-grey'} />
                            <span>{menu.id}</span>
                        </button>
                    ))}
                </aside>

                {/* Settings Content Area */}
                <div className="p-12 overflow-y-auto">
                    {activeTab === 'Routing' && <RoutingSettings />}
                    {activeTab === 'Knowledge Base' && <KnowledgeSettings />}
                    {activeTab !== 'Routing' && activeTab !== 'Knowledge Base' && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                            <div className="w-16 h-16 bg-soft-bg rounded-full flex items-center justify-center text-black/10"><Plus size={40} /></div>
                            <h3 className="text-xl font-black text-charcoal tracking-tight">{activeTab} Settings</h3>
                            <p className="max-w-xs text-slate-grey font-medium leading-relaxed">Configurations for {activeTab.toLowerCase()} are currently being optimized for the next update.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const RoutingSettings = () => {
    const rules = [
        { id: 1, trigger: 'Keyword: "Seed" or "Soil"', unit: 'GROW', status: 'Active', today: 42, color: 'bg-seedlink-green' },
        { id: 2, trigger: 'Keyword: "Order" or "Status"', unit: 'SOW', status: 'Active', today: 128, color: 'bg-blue-accent' },
        { id: 3, trigger: 'Sentiment: Extremely Angry', unit: 'Supervisor', status: 'Active', today: 12, color: 'bg-error' },
        { id: 4, trigger: 'Source: Website Live Chat', unit: 'CONNECT', status: 'Inactive', today: 0, color: 'bg-slate-grey' },
    ];

    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-black text-charcoal tracking-tight">Intelligent Routing Engine</h2>
                    <p className="text-slate-grey font-semibold mt-1 opacity-60">Configure automated logic to direct conversations to specialized business units.</p>
                </div>
                <button className="flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-black/10 hover:scale-105 transition-all active:scale-95">
                    <Plus size={16} /> New Rule
                </button>
            </div>

            {/* Visual Workspace Summary */}
            <div className="grid grid-cols-4 gap-6 p-8 bg-soft-bg/80 border border-black/5 rounded-[2rem] shadow-inner">
                {[
                    { label: "Incoming Traffic", value: "1,420", color: "text-charcoal" },
                    { label: "Automated", value: "89%", color: "text-seedlink-green" },
                    { label: "Human Direct", value: "11%", color: "text-blue-accent" },
                    { label: "Escalated", value: "4%", color: "text-error" }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-grey opacity-60 underline decoration-slate-grey/20 underline-offset-4 mb-1">{stat.label}</span>
                        <span className={`text-3xl font-black tracking-tighter italic ${stat.color}`}>{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-grey uppercase tracking-[0.2em] px-4 opacity-50">
                    <Workflow size={16} /> Rule Pipeline Pipeline
                </div>

                {rules.map((rule) => (
                    <div key={rule.id} className="group flex items-center gap-8 p-6 bg-white border border-black/5 rounded-3xl hover:border-seedlink-green/20 hover:shadow-2xl hover:shadow-black/5 transition-all cursor-pointer relative overflow-hidden">
                        {rule.status === 'Active' && <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 ${rule.color}`}></div>}

                        {/* Flow Visualizer Block */}
                        <div className={`w-2 h-16 rounded-full shrink-0 ${rule.status === 'Active' ? rule.color : 'bg-slate-200'} shadow-sm`} />

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Search size={16} className="text-slate-grey opacity-40" />
                                <span className="text-md font-black text-charcoal tracking-tight">{rule.trigger}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-grey">
                                <ArrowRight size={14} className="text-seedlink-green" /> Direct to <strong className="text-charcoal italic">{rule.unit} Unit</strong>
                                <span className="w-1 h-1 rounded-full bg-black/10 mx-2"></span>
                                <span className="opacity-80 underline decoration-dotted underline-offset-4">{rule.today} routed today</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 px-8 border-l border-black/5">
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[9px] font-black text-slate-grey uppercase tracking-widest opacity-40">Operational Status</span>
                                <span className={`text-xs font-black italic ${rule.status === 'Active' ? 'text-seedlink-green' : 'text-slate-grey'}`}>
                                    {rule.status.toUpperCase()}
                                </span>
                            </div>
                            <button className="p-3 text-slate-grey/40 hover:text-error hover:bg-error/5 rounded-xl transition-all active:scale-90">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simulated Logic Visualizer */}
            <div className="p-10 bg-charcoal rounded-[2.5rem] text-white mt-6 border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                    <Zap size={140} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 space-y-4">
                        <h3 className="text-lg font-black italic flex items-center gap-3 tracking-tight">
                            <Sparkles size={20} className="text-seedlink-green animate-pulse" /> AI Dynamic Optimization
                        </h3>
                        <p className="text-sm text-slate-grey leading-relaxed font-medium">
                            Seedlink’s autonomous auditing layer tracks user intent drift. If patterns shift by &gt;5%, the system will suggest new routing pathways automatically.
                        </p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                        <div className="px-5 py-2.5 bg-white/5 rounded-2xl text-[10px] font-black border border-white/10 flex items-center gap-3 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-seedlink-green animate-pulse" /> DRIFT: 0.12%
                        </div>
                        <div className="px-5 py-2.5 bg-white/5 rounded-2xl text-[10px] font-black border border-white/10 flex items-center gap-3 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-seedlink-green animate-pulse" /> LATENCY: 2ms
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KnowledgeSettings = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [docs, setDocs] = useState([
        { id: 1, name: "Autumn_Wheat_Guide.pdf", size: "2.4 MB", status: "Synced", date: "Jan 05, 2026", tokens: "4,200" },
        { id: 2, name: "Fertilizer_Pro_Manual.pdf", size: "1.1 MB", status: "Synced", date: "Jan 02, 2026", tokens: "1,850" }
    ]);

    const simulateUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setDocs([
                { id: Date.now(), name: "Soil_Science_Basics.pdf", size: "3.8 MB", status: "Indexing", date: "Just now", tokens: "..." },
                ...docs
            ]);
            setIsUploading(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-black text-charcoal tracking-tight">Knowledge Engine</h2>
                    <p className="text-slate-grey font-semibold mt-1 opacity-60">Upload documents to "train" the AI on your specific business logic and products.</p>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                className="bg-white border-2 border-dashed border-black/10 rounded-[2.5rem] p-16 text-center cursor-pointer hover:border-seedlink-green/40 hover:bg-seedlink-green/5 transition-all group active:scale-95"
                onClick={simulateUpload}
            >
                <div className="flex flex-col items-center gap-6">
                    {isUploading ? (
                        <>
                            <Loader2 className="animate-spin text-seedlink-green" size={48} />
                            <p className="text-lg font-black text-charcoal italic animate-pulse">Analyzing and Vectorizing Document...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-soft-bg rounded-3xl flex items-center justify-center text-slate-grey group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                                <UploadCloud size={40} />
                            </div>
                            <div className="space-y-1">
                                <strong className="text-xl font-black text-charcoal tracking-tight block">Click to upload or drag and drop</strong>
                                <span className="text-xs font-bold text-slate-grey opacity-60 uppercase tracking-widest">PDF, DOCX or CSV (Max 20MB)</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white border border-black/5 rounded-[2rem] overflow-hidden shadow-xl shadow-black/5">
                <div className="px-8 py-5 bg-soft-bg/50 border-b border-black/5 flex items-center gap-3 text-[10px] font-black text-slate-grey uppercase tracking-[0.2em]">
                    <Database size={16} /> Active Training Documents ({docs.length})
                </div>
                <div className="bg-white">
                    {docs.map((doc) => (
                        <div key={doc.id} className="flex justify-between items-center px-8 py-6 border-b border-black/5 last:border-none group">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-soft-bg rounded-2xl flex items-center justify-center text-slate-grey group-hover:bg-seedlink-green-soft group-hover:text-seedlink-green transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-black text-charcoal tracking-tight">{doc.name}</div>
                                    <div className="text-[10px] font-bold text-slate-grey flex items-center gap-2 opacity-60 mt-0.5 uppercase tracking-tighter">
                                        {doc.size} <span className="w-px h-2 bg-black/10 mx-1"></span> {doc.date}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-10">
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm
                                    ${doc.status === 'Synced' ? 'bg-seedlink-green/10 text-seedlink-green' : 'bg-blue-soft text-blue-accent'}
                                `}>
                                    {doc.status === 'Indexing' && <Loader2 size={10} className="animate-spin" />}
                                    {doc.status}
                                </div>
                                <div className="text-center min-w-[100px]">
                                    <div className="text-xs font-black text-charcoal">{doc.tokens}</div>
                                    <div className="text-[8px] font-black text-slate-grey uppercase opacity-40">Tokens</div>
                                </div>
                                <button className="p-3 text-slate-grey hover:text-error hover:bg-error/5 rounded-xl transition-all active:scale-90">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggested Section */}
            <div className="space-y-6">
                <div className="flex flex-col gap-1 px-8">
                    <h3 className="text-xs font-black text-blue-accent flex items-center gap-2 uppercase tracking-[0.2em]">
                        <Sparkles size={16} /> AI Knowledge Mining
                    </h3>
                    <p className="text-xs font-bold text-slate-grey opacity-60">Patterns detected in conversation history missing from KB.</p>
                </div>

                <div className="grid gap-4">
                    {[
                        { title: "Solar Pump Installation FAQ", reason: "12 customers asked about \"Installation time\" this week (Unanswered)", source: "seedlink.com/faq/solar-pumps" },
                        { title: "Pesticide Safety Sheet - GROW", reason: "New regulatory mentions detected in \"GROW\" conversations.", source: "regulatory_safety_2026.pdf" }
                    ].map((item, i) => (
                        <div key={i} className="bg-blue-soft/50 p-6 rounded-3xl border border-blue-accent/10 flex justify-between items-center group hover:bg-white hover:border-blue-accent/30 transition-all cursor-pointer shadow-sm hover:shadow-xl">
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-white rounded-2xl text-blue-accent border border-blue-accent/5 group-hover:scale-110 transition-transform">
                                    <Lightbulb size={24} />
                                </div>
                                <div>
                                    <div className="text-md font-black text-charcoal tracking-tight">{item.title}</div>
                                    <div className="text-xs font-bold text-slate-grey opacity-60 mt-0.5 italic">{item.reason}</div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-accent mt-2 uppercase tracking-tighter decoration-dotted underline underline-offset-4">
                                        <ExternalLink size={10} /> {item.source}
                                    </div>
                                </div>
                            </div>
                            <button className="bg-white text-blue-accent px-6 py-3 rounded-2xl text-[10px] font-black border border-blue-accent/20 hover:bg-blue-accent hover:text-white transition-all shadow-md active:scale-95 uppercase tracking-widest leading-none">
                                Index Source
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6 mt-10 p-10 bg-white border border-black/5 rounded-[2.5rem] shadow-sm">
                <h3 className="text-[10px] font-black text-slate-grey uppercase tracking-[0.2em] px-4 opacity-40">External Engine Integrations</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <SourceItem
                        name="Shopify Store"
                        status="Synced"
                        lastUpdate="12 mins ago"
                        items="1,242 Products"
                        icon={<Database size={22} />}
                    />
                    <SourceItem
                        name="Seedlink Website"
                        status="Indexing"
                        lastUpdate="In progress..."
                        items="42 Pages"
                        icon={<Globe size={22} />}
                    />
                </div>
            </div>
        </div>
    );
};

interface SourceItemProps {
    name: string;
    status: string;
    lastUpdate: string;
    items: string;
    icon: React.ReactNode;
}

const SourceItem = ({ name, status, lastUpdate, items, icon }: SourceItemProps) => (
    <div className="p-6 bg-soft-bg/80 border border-black/5 rounded-3xl flex justify-between items-start group hover:bg-white hover:border-seedlink-green/20 transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]">
        <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-slate-grey group-hover:text-charcoal group-hover:scale-110 transition-all shadow-sm">
                {icon}
            </div>
            <div className="space-y-1">
                <div className="text-md font-black text-charcoal tracking-tight">{name}</div>
                <div className="text-[10px] font-black text-seedlink-green uppercase tracking-widest">{items} • {status.toUpperCase()}</div>
                <div className="text-[9px] font-bold text-slate-grey italic opacity-60">Last sync: {lastUpdate}</div>
            </div>
        </div>
        <button className="p-3 text-slate-grey/40 hover:text-charcoal group-hover:rotate-180 transition-all duration-500">
            <RefreshCcw size={18} />
        </button>
    </div>
);

export default SettingsPage;
