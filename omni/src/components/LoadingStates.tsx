import React from 'react';

// Skeleton for thread list items
export const ThreadSkeleton = () => {
    return (
        <div className="px-6 py-5 border-b border-black/5 animate-pulse">
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="h-4 bg-soft-bg rounded-lg w-32"></div>
                        <div className="h-5 bg-soft-bg rounded-full w-16"></div>
                    </div>
                    <div className="h-3 bg-soft-bg rounded w-8"></div>
                </div>
                <div className="h-3 bg-soft-bg rounded-lg w-3/4"></div>
                <div className="flex items-center gap-3">
                    <div className="h-6 bg-soft-bg rounded-lg w-20"></div>
                    <div className="h-6 bg-soft-bg rounded-lg w-16"></div>
                </div>
            </div>
        </div>
    );
};

// Skeleton for message bubbles
export const MessageSkeleton = ({ align = 'left' }: { align?: 'left' | 'right' }) => {
    return (
        <div className={`flex flex-col gap-1 items-${align === 'left' ? 'start' : 'end'} max-w-[80%] ${align === 'right' ? 'self-end' : ''} animate-pulse`}>
            <div className={`h-16 bg-soft-bg rounded-2xl ${align === 'left' ? 'rounded-tl-none' : 'rounded-tr-none'} w-64`}></div>
            <div className={`h-2 bg-soft-bg rounded w-20 ${align === 'right' ? 'mr-1' : 'ml-1'}`}></div>
        </div>
    );
};

// Skeleton for context cards
export const ContextCardSkeleton = () => {
    return (
        <div className="p-5 bg-white border border-black/5 rounded-2xl shadow-sm space-y-4 animate-pulse">
            <div className="h-4 bg-soft-bg rounded-lg w-24"></div>
            <div className="space-y-2">
                <div className="h-3 bg-soft-bg rounded-lg w-full"></div>
                <div className="h-3 bg-soft-bg rounded-lg w-5/6"></div>
                <div className="h-3 bg-soft-bg rounded-lg w-4/6"></div>
            </div>
            <div className="flex gap-2">
                <div className="h-8 bg-soft-bg rounded-lg flex-1"></div>
                <div className="h-8 bg-soft-bg rounded-lg flex-1"></div>
            </div>
        </div>
    );
};

// Skeleton for stats/metrics
export const StatCardSkeleton = () => {
    return (
        <div className="p-6 bg-white border border-black/5 rounded-2xl shadow-sm space-y-3 animate-pulse">
            <div className="h-3 bg-soft-bg rounded w-20"></div>
            <div className="h-8 bg-soft-bg rounded-lg w-24"></div>
            <div className="h-2 bg-soft-bg rounded-full w-full"></div>
        </div>
    );
};

// Pulsing dot indicator
export const PulsingDot = ({ color = 'seedlink-green' }: { color?: string }) => {
    return (
        <div className="relative flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full bg-${color} animate-pulse`}></div>
            <div className={`absolute w-2 h-2 rounded-full bg-${color} animate-ping opacity-75`}></div>
        </div>
    );
};

// Shimmer effect overlay
export const ShimmerOverlay = () => {
    return (
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
    );
};
