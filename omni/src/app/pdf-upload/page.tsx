"use client";

import React, { useState } from 'react';
import { FileUp, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

const UPLOAD_API = 'https://caiphas-dev-n8n.syvyo.com/webhook/Upload_file';

const PdfUploadPage = () => {
    const { showToast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            if (selected.type !== 'application/pdf') {
                showToast('error', 'Please select a PDF file only');
                setFile(null);
                return;
            }
            setFile(selected);
            setIsSuccess(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            showToast('error', 'Please select a PDF file first');
            return;
        }

        setIsUploading(true);
        setIsSuccess(false);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(UPLOAD_API, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const result = await response.json().catch(() => ({}));
            setIsSuccess(true);
            showToast('success', 'Document uploaded successfully');
            handleReset();
        } catch (error) {
            console.error('Upload error:', error);
            showToast('error', 'Failed to upload document. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setIsSuccess(false);
        const input = document.getElementById('pdf-input') as HTMLInputElement | null;
        if (input) input.value = '';
    };

    return (
        <div className="p-10 bg-soft-bg min-h-screen">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-charcoal tracking-tight">Document Upload</h1>
                <p className="mt-1 text-sm font-medium text-slate-grey">Upload PDF documents to process</p>
            </header>

            <div className="max-w-xl bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-charcoal uppercase tracking-wider">
                            Select PDF File
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-black/10 rounded-xl cursor-pointer bg-soft-bg/50 hover:bg-soft-bg hover:border-seedlink-green/30 transition-all">
                            <input
                                id="pdf-input"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {file ? (
                                <div className="flex flex-col items-center gap-2">
                                    <FileText size={40} className="text-seedlink-green" />
                                    <span className="text-sm font-bold text-charcoal">{file.name}</span>
                                    <span className="text-xs text-slate-grey">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <FileUp size={40} className="text-slate-grey" />
                                    <span className="text-sm font-bold text-charcoal">Click or drag PDF here</span>
                                    <span className="text-xs text-slate-grey">PDF files only</span>
                                </div>
                            )}
                        </label>
                    </div>

                    {isSuccess && (
                        <div className="flex items-center gap-3 p-4 bg-seedlink-green-soft border border-seedlink-green/20 rounded-xl">
                            <CheckCircle2 size={20} className="text-seedlink-green shrink-0" />
                            <span className="text-sm font-bold text-charcoal">Upload completed successfully</span>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={!file || isUploading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-seedlink-green text-white rounded-xl font-bold shadow-lg shadow-seedlink-green/20 hover:bg-seedlink-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <FileUp size={18} />
                                    Upload Document
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={!file || isUploading}
                            className="px-6 py-3.5 bg-soft-bg text-charcoal rounded-xl font-bold hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PdfUploadPage;
