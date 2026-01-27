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
        <div className="flex h-screen overflow-hidden bg-soft-bg">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
                {children}
            </main>
            <CommandMenu />
        </div>
    );
}
