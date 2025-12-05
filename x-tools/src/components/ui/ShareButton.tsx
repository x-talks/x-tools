import { useState } from 'react';
import { Share2, Link, Check } from 'lucide-react';
import { Button } from './Button';
import { useWizard } from '../../core/store';

export function ShareButton() {
    const { state } = useWizard();
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const teamId = state.team?.teamId;

    if (!teamId) return null;

    // Use current URL or construct one if we are in a non-root path
    // Assuming simple query param ?teamId=...
    const getShareUrl = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('teamId', teamId);
        return url.toString();
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getShareUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="gap-2 bg-white/50 backdrop-blur border-blue-200 text-blue-700 hover:bg-blue-50"
            >
                <Share2 className="w-3.5 h-3.5" />
                Share
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 animate-in slide-in-from-top-2">
                        <h3 className="text-sm font-semibold mb-2 text-slate-900 dark:text-slate-100">
                            Invite Team
                        </h3>
                        <p className="text-xs text-slate-500 mb-3">
                            Share this link to collaborate in real-time.
                        </p>

                        <div className="flex gap-2">
                            <input
                                readOnly
                                value={getShareUrl()}
                                className="flex-1 text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 outline-none"
                            />
                            <Button
                                size="sm"
                                onClick={handleCopy}
                                variant={copied ? "primary" : "outline"}
                                className={copied ? "bg-green-600 hover:bg-green-700 border-green-600" : ""}
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
