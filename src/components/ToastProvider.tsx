"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Zap } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'ai';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = { id, type, message, duration };

        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: string) => void }) => {
    return (
        <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

const ToastItem = ({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) => {
    const configs = {
        success: {
            icon: CheckCircle2,
            bgColor: 'bg-success/10',
            borderColor: 'border-success/20',
            textColor: 'text-success',
            iconColor: 'text-success'
        },
        error: {
            icon: AlertCircle,
            bgColor: 'bg-error/10',
            borderColor: 'border-error/20',
            textColor: 'text-error',
            iconColor: 'text-error'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-accent/10',
            borderColor: 'border-blue-accent/20',
            textColor: 'text-blue-accent',
            iconColor: 'text-blue-accent'
        },
        ai: {
            icon: Zap,
            bgColor: 'bg-seedlink-green/10',
            borderColor: 'border-seedlink-green/20',
            textColor: 'text-seedlink-green',
            iconColor: 'text-seedlink-green'
        }
    };

    const config = configs[toast.type];
    const Icon = config.icon;

    return (
        <div
            className={`
                pointer-events-auto
                flex items-center gap-3 
                px-5 py-4 
                ${config.bgColor} 
                backdrop-blur-xl 
                border ${config.borderColor}
                rounded-2xl 
                shadow-2xl shadow-black/10
                min-w-[320px] max-w-md
                animate-in slide-in-from-right-full fade-in duration-300
            `}
        >
            <Icon className={`${config.iconColor} shrink-0 ${toast.type === 'ai' ? 'animate-pulse' : ''}`} size={20} />
            <p className={`text-sm font-bold ${config.textColor} flex-1 leading-relaxed`}>
                {toast.message}
            </p>
            <button
                onClick={() => onRemove(toast.id)}
                className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
                <X className="text-slate-grey" size={16} />
            </button>
        </div>
    );
};
