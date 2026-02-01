"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Inbox,
    Phone,
    LayoutDashboard,
    Settings,
    Menu,
    X
} from 'lucide-react';

const navItems = [
    { icon: Inbox, label: 'Unified Inbox', href: '/inbox' },
    { icon: Phone, label: 'Call Workspace', href: '/calls' },
    { icon: LayoutDashboard, label: 'Supervisor', href: '/supervisor' },
];

const secondaryNavItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
];

const Sidebar = () => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const NavItem = ({ item }: { item: any }) => {
        const isActive = pathname.startsWith(item.href);
        return (
            <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
                    ${isActive
                        ? 'bg-seedlink-green text-white shadow-lg shadow-seedlink-green/20'
                        : 'text-slate-grey hover:bg-black/5 hover:text-charcoal'
                    }`}
            >
                <item.icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-grey group-hover:text-charcoal'}`} />
                <span>{item.label}</span>
            </Link>
        );
    };

    return (
        <>
            <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-xl shadow-lg border border-black/5 text-charcoal">
                <Menu size={20} />
            </button>
            <div className={`fixed inset-0 bg-black/20 z-40 lg:hidden ${mobileOpen ? 'block' : 'hidden'}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />
            <aside className={`w-64 h-screen bg-white border-r border-black/5 flex flex-col shrink-0 fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-seedlink-green flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">S</div>
                    <span className="text-lg font-bold text-charcoal tracking-tight">Seedlink</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 -mr-2 hover:bg-black/5 rounded-lg">
                    <X size={18} />
                </button>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-6">
                <div className="space-y-1">
                    {navItems.map((item) => <NavItem key={item.href} item={item} />)}
                </div>

                <div className="mx-4 h-px bg-black/5" />

                <div className="space-y-4">
                    <div className="px-4 text-[10px] font-bold text-slate-grey uppercase tracking-widest opacity-50">Administration</div>
                    <div className="space-y-1">
                        {secondaryNavItems.map((item) => <NavItem key={item.href} item={item} />)}
                    </div>
                </div>
            </nav>

            <div className="mx-4 mb-4 p-3 rounded-xl bg-seedlink-green-soft border border-seedlink-green/20 flex items-center gap-3 transition-transform hover:scale-[1.02]">
                <div className="w-2 h-2 rounded-full bg-seedlink-green animate-pulse"></div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-grey">System Status</span>
                    <span className="text-xs font-semibold text-charcoal">Operational</span>
                </div>
            </div>

            <div className="p-4 border-t border-black/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-soft-bg flex items-center justify-center text-xs font-bold text-charcoal border border-black/5">JD</div>
                <div className="flex flex-col min-w-0">
                    <div className="text-sm font-bold text-charcoal truncate">John Doe</div>
                    <div className="text-[10px] font-bold text-slate-grey uppercase tracking-tighter">SOW Agent</div>
                </div>
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
