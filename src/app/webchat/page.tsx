"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    MessageCircle,
    Globe,
    Clock,
    User,
    Phone
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

const WebChatPage = () => {
    const { showToast } = useToast();
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isPhoneNumberSet, setIsPhoneNumberSet] = useState(false);
    const [messageInput, setMessageInput] = useState('');
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

    // Fetch messages when phone number is set
    useEffect(() => {
        if (!isPhoneNumberSet || !phoneNumber) return;

        const fetchMessages = async (silent = false) => {
            if (!silent) setIsMessagesLoading(true);
            try {
                const response = await fetch(`https://caiphas-dev-n8n.syvyo.com/webhook/whatsapp/api?conversation_id=${phoneNumber}`);
                const data = await response.json();
                setActiveMessages(data || []);
            } catch (error) {
                console.error('Error fetching messages:', error);
                if (!silent) showToast('error', 'Failed to fetch messages');
            } finally {
                if (!silent) setIsMessagesLoading(false);
            }
        };

        fetchMessages();

        const pollInterval = setInterval(() => {
            fetchMessages(true);
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [phoneNumber, isPhoneNumberSet]);

    const handleSetPhoneNumber = () => {
        if (!phoneNumber.trim()) {
            showToast('error', 'Please enter a phone number');
            return;
        }
        setIsPhoneNumberSet(true);
        showToast('success', `Chatting with ${phoneNumber}`);
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !phoneNumber || !isPhoneNumberSet) return;

        const text = messageInput.trim();
        setMessageInput('');

        setIsSending(true);

        // Optimistically add message to UI
        // Set direction to 'inbound' so it appears on right side with grey background
        const optimisticMessage = {
            id: Date.now(),
            text: text,
            direction: 'inbound',
            timestamp: new Date().toISOString(),
            status: 'sending'
        };
        setActiveMessages(prev => [...prev, optimisticMessage]);

        try {
            // Encode the message for URL
            const encodedMessage = encodeURIComponent(text);
            const encodedPhoneNumber = encodeURIComponent(phoneNumber);

            const response = await fetch(
                `https://caiphas-dev-n8n.syvyo.com/webhook/webchat?messages=${encodedMessage}&phone_number=${encodedPhoneNumber}`,
                {
                    method: 'GET',
                }
            );

            if (!response.ok) throw new Error('Failed to send message');

            // Update optimistic message to sent status
            setActiveMessages(prev => prev.map(msg =>
                msg.id === optimisticMessage.id
                    ? { ...msg, status: 'sent' }
                    : msg
            ));

            showToast('success', 'Message sent successfully');
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('error', 'Failed to send message. Please try again.');
            // Remove failed message
            setActiveMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return "";
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleResetChat = () => {
        setIsPhoneNumberSet(false);
        setPhoneNumber('');
        setActiveMessages([]);
        setMessageInput('');
    };

    return (
        <div className="flex flex-col h-screen bg-soft-bg">
            <header className="px-6 pt-6 pb-4 bg-white border-b border-black/5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-seedlink-green/10 flex items-center justify-center">
                            <Globe size={20} className="text-seedlink-green" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-charcoal tracking-tight">Web Chat</h1>
                            <p className="text-xs font-bold text-slate-grey">Chat with customers via web</p>
                        </div>
                    </div>
                    {isPhoneNumberSet && (
                        <button
                            onClick={handleResetChat}
                            className="px-4 py-2 bg-seedlink-green text-white text-sm font-black rounded-xl shadow-lg shadow-seedlink-green/20 hover:bg-seedlink-green/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <span>+</span> Create new Chat
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {!isPhoneNumberSet ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="w-24 h-24 rounded-2xl bg-soft-bg flex items-center justify-center mb-6">
                            <Phone size={40} className="text-slate-grey" />
                        </div>
                        <h2 className="text-xl font-black text-charcoal mb-2">Enter Phone Number</h2>
                        <p className="text-sm text-slate-grey mb-8 text-center max-w-md">
                            Enter the phone number you want to chat with to start the conversation
                        </p>
                        <div className="w-full max-w-md space-y-4">
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey" size={18} />
                                <input
                                    type="text"
                                    placeholder="Enter phone number (e.g., test_user_2)"
                                    className="w-full pl-12 pr-4 py-4 bg-soft-bg border-transparent focus:bg-white focus:border-seedlink-green/20 focus:ring-8 focus:ring-seedlink-green/5 rounded-2xl text-sm transition-all outline-none"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSetPhoneNumber();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSetPhoneNumber}
                                className="w-full px-6 py-4 bg-seedlink-green text-white rounded-2xl text-sm font-black shadow-lg shadow-seedlink-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={18} />
                                Start Chatting
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-black/5 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-soft-bg flex items-center justify-center text-lg font-black text-charcoal shadow-inner">
                                    {phoneNumber.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-charcoal tracking-tight">{phoneNumber}</h2>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-grey">
                                        <Globe size={12} className="text-seedlink-green" />
                                        <span>Web Chat</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col scroll-smooth">
                            {isMessagesLoading && activeMessages.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-grey gap-4">
                                    <div className="animate-spin">
                                        <Clock size={32} />
                                    </div>
                                    <p className="font-bold text-sm">Loading messages...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center">
                                        <span className="px-4 py-1 bg-soft-bg text-[10px] font-bold text-slate-grey uppercase tracking-widest rounded-full">
                                            Conversation Started
                                        </span>
                                    </div>

                                    {activeMessages.length > 0 ? (
                                        activeMessages.map((msg) => (
                                            <div
                                                key={msg.id || msg.message_id || Math.random()}
                                                className={`flex flex-col gap-1 max-w-[80%] ${msg.direction === 'outbound' ? 'items-start self-start' : 'items-end self-end'}`}
                                            >
                                                <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                                                    msg.direction === 'outbound'
                                                        ? 'bg-seedlink-green text-white rounded-tl-none shadow-md shadow-seedlink-green/20'
                                                        : 'bg-soft-bg text-charcoal rounded-tr-none border border-black/5'
                                                }`}>
                                                    {msg.text || msg.message}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-grey mx-1">
                                                    {formatTime(msg.timestamp)}
                                                    {msg.direction === 'outbound' && (
                                                        msg.status === 'sending' ? ' • Sending...' : ' • Sent'
                                                    )}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-grey gap-4">
                                            <MessageCircle size={48} className="opacity-20" />
                                            <p className="font-bold text-sm">No messages yet. Start the conversation!</p>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-6 bg-white border-t border-black/5 space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="w-full pl-4 pr-24 py-4 bg-soft-bg border-transparent focus:bg-white focus:border-seedlink-green/20 focus:ring-8 focus:ring-seedlink-green/5 rounded-2xl text-sm transition-all outline-none"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    disabled={isSending}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button
                                        className={`p-2.5 bg-charcoal text-white rounded-xl shadow-lg shadow-black/10 hover:bg-slate-800 transition-all active:scale-90 ${
                                            isSending ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        onClick={handleSendMessage}
                                        disabled={isSending || !messageInput.trim()}
                                    >
                                        <Send size={18} className={isSending ? 'animate-pulse' : ''} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WebChatPage;
