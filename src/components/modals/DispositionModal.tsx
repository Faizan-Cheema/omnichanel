"use client";

import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface DispositionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (disposition: string) => void;
}

const dispositions = [
    "Resolved: Product Inquiry",
    "Resolved: Order Status",
    "Escalated to Agronomy Team",
    "Spam / Wrong Number",
    "Follow-up Scheduled"
];

const DispositionModal = ({ isOpen, onClose, onConfirm }: DispositionModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-card-white w-full max-w-[440px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-6 py-4 border-b border-black/5">
                    <h3 className="text-lg font-bold text-charcoal">Close Conversation</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-soft-bg rounded-lg text-slate-grey transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-slate-grey mb-6">Please select a disposition to categorize this interaction before closing.</p>
                    <div className="flex flex-col gap-2">
                        {dispositions.map((d) => (
                            <button
                                key={d}
                                className="group flex justify-between items-center p-4 bg-soft-bg hover:bg-seedlink-green hover:text-white rounded-xl text-left text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                                onClick={() => onConfirm(d)}
                            >
                                <span>{d}</span>
                                <CheckCircle2 size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-soft-bg px-6 py-4 flex justify-end">
                    <button
                        className="px-4 py-2 text-sm font-bold text-slate-grey hover:text-charcoal transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DispositionModal;
