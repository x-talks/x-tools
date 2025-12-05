import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

export function KeyboardShortcutsHint() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasSeenHint, setHasSeenHint] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem('keyboard_hints_seen');
        if (!seen) {
            // Show hint after 3 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setHasSeenHint(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('keyboard_hints_seen', 'true');
        setHasSeenHint(true);
    };

    if (!isVisible && !hasSeenHint) return null;

    return (
        <>
            {/* Floating hint */}
            {isVisible && (
                <div className="fixed bottom-6 left-6 z-40 glass-card p-4 max-w-sm animate-in slide-in-from-bottom-5 fade-in">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2">
                                    Keyboard Shortcuts
                                </h3>
                                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">Ctrl+Z</kbd>
                                        <span>Undo</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">Ctrl+Y</kbd>
                                        <span>Redo</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">Ctrl+S</kbd>
                                        <span>Save</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Permanent toggle button */}
            {hasSeenHint && (
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="fixed bottom-6 left-6 z-40 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                    title="Keyboard Shortcuts"
                >
                    <Keyboard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
            )}
        </>
    );
}
