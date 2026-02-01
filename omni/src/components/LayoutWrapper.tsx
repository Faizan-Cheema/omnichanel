"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import CommandMenu from '@/components/CommandMenu';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    const isWebChatPage = pathname === '/webchat';

    if (isLoginPage || isWebChatPage) {
        return (
            <div className="min-h-screen bg-soft-bg">
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-soft-bg min-w-0">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto relative pl-14 lg:pl-0">
                {children}
            </main>
            <CommandMenu />
        </div>
    );
}
