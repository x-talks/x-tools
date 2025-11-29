import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Settings, Key, Check, AlertCircle, Cpu } from 'lucide-react';
import AI from '../core/ai';

export function AISettings() {
    const [isOpen, setIsOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        const key = AI.getGroqApiKey();
        if (key) setApiKey(key);
    }, [isOpen]);

    const handleSave = async () => {
        if (!apiKey.trim()) {
            AI.configure('');
            setStatus('idle');
            return;
        }

        try {
            AI.configure(apiKey.trim());
            // Simple test call
            await AI.analyzeText('Test connection');
            setStatus('success');
            setTimeout(() => setIsOpen(false), 1500);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} title="AI Settings">
                <Settings className="h-5 w-5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" />
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Cpu className="h-5 w-5 text-blue-500" />
                                AI Configuration
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="sr-only">Close</span>
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Groq API Key (Free)
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => {
                                            setApiKey(e.target.value);
                                            setStatus('idle');
                                        }}
                                        placeholder="gsk_..."
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <p className="text-xs text-slate-500">
                                    Get a free key at <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">console.groq.com</a>.
                                    Without a key, the app uses basic rule-based logic.
                                </p>
                            </div>

                            {status === 'success' && (
                                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                    <Check className="h-4 w-4" />
                                    Connection successful!
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                    <AlertCircle className="h-4 w-4" />
                                    Connection failed. Check your key.
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Configuration</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
