import React from 'react';
import {
    Inbox,
    MessageSquare,
    Phone,
    Search,
    Sparkles,
    FileQuestion,
    WifiOff
} from 'lucide-react';

interface EmptyStateProps {
    type: 'inbox' | 'search' | 'messages' | 'calls' | 'knowledge' | 'offline';
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState = ({
    type,
    title,
    description,
    actionLabel,
    onAction
}: EmptyStateProps) => {
    const configs = {
        inbox: {
            icon: Inbox,
            defaultTitle: 'All Caught Up!',
            defaultDescription: 'No new conversations at the moment. Your team is doing great!',
            color: 'seedlink-green'
        },
        search: {
            icon: Search,
            defaultTitle: 'No Results Found',
            defaultDescription: 'Try adjusting your search terms or filters.',
            color: 'slate-grey'
        },
        messages: {
            icon: MessageSquare,
            defaultTitle: 'No Messages Yet',
            defaultDescription: 'Start a conversation to see messages here.',
            color: 'blue-accent'
        },
        calls: {
            icon: Phone,
            defaultTitle: 'No Active Calls',
            defaultDescription: 'Waiting for incoming calls or dial a number to start.',
            color: 'blue-accent'
        },
        knowledge: {
            icon: FileQuestion,
            defaultTitle: 'Knowledge Base Empty',
            defaultDescription: 'Upload documents or connect data sources to build your knowledge base.',
            color: 'warning'
        },
        offline: {
            icon: WifiOff,
            defaultTitle: 'Connection Lost',
            defaultDescription: 'Please check your internet connection and try again.',
            color: 'error'
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
            {/* Animated Icon Container */}
            <div className="relative mb-8 group">
                {/* Background glow */}
                <div className={`absolute inset-0 bg-${config.color}/10 rounded-full blur-2xl scale-150 group-hover:scale-[2] transition-transform duration-700`}></div>

                {/* Icon */}
                <div className={`relative w-24 h-24 rounded-full bg-${config.color}/10 border-2 border-${config.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`text-${config.color} group-hover:rotate-12 transition-transform duration-300`} size={40} strokeWidth={1.5} />
                </div>

                {/* Floating sparkles */}
                {type === 'inbox' && (
                    <>
                        <Sparkles className="absolute -top-2 -right-2 text-seedlink-green animate-pulse" size={16} />
                        <Sparkles className="absolute -bottom-2 -left-2 text-seedlink-green animate-pulse delay-300" size={12} />
                    </>
                )}
            </div>

            {/* Text Content */}
            <h3 className="text-2xl font-black text-charcoal tracking-tight mb-3">
                {title || config.defaultTitle}
            </h3>
            <p className="text-slate-grey font-medium max-w-md mb-8 leading-relaxed">
                {description || config.defaultDescription}
            </p>

            {/* Action Button */}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className={`px-6 py-3 bg-${config.color} text-white rounded-xl font-bold text-sm shadow-lg shadow-${config.color}/20 hover:scale-105 active:scale-95 transition-all`}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

// Specialized empty state for conversation threads
export const EmptyThreadList = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12 px-6">
            <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-soft-bg flex items-center justify-center mb-6 shadow-inner">
                    <MessageSquare className="text-slate-grey" size={32} strokeWidth={1.5} />
                </div>
            </div>
            <h4 className="text-lg font-bold text-charcoal mb-2">No Conversations</h4>
            <p className="text-sm text-slate-grey text-center max-w-xs">
                Conversations will appear here when customers reach out via any channel.
            </p>
        </div>
    );
};

// Empty state for AI insights when no data
export const EmptyInsights = () => {
    return (
        <div className="p-6 bg-soft-bg/50 rounded-2xl border border-dashed border-black/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center mx-auto">
                <Sparkles className="text-slate-grey" size={20} />
            </div>
            <div className="space-y-1">
                <div className="text-xs font-bold text-charcoal">No Insights Yet</div>
                <div className="text-[10px] text-slate-grey font-medium">
                    AI will analyze this conversation as it progresses.
                </div>
            </div>
        </div>
    );
};
