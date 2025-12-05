import { useState, useEffect } from 'react';
import { useWizard } from '../core/store';
import { critiqueContent, CritiqueResult, PersonaType } from '../core/critique';
import { Bot, ThumbsUp, ThumbsDown, Sparkles, X } from 'lucide-react';

export function Facilitator() {
    const { state } = useWizard();
    const [critique, setCritique] = useState<CritiqueResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [persona, setPersona] = useState<PersonaType>('Analyst');
    const [lastAnalyzed, setLastAnalyzed] = useState<string>("");

    // Map step to content
    // Steps: 1:Purpose, 2:Vision, 3:Mission, 4:Strategy
    // Check WizardOrchestrator for step indices vs logic
    const getCurrentContent = () => {
        switch (state.currentStep) {
            case 1: return { type: 'Purpose', text: state.team?.teamPurpose || '' };
            case 2: return { type: 'Vision', text: state.vision?.text || '' };
            case 3: return { type: 'Mission', text: state.mission?.text || '' };
            case 4: return { type: 'Strategy', text: state.strategy?.text || '' };
            default: return null;
        }
    };

    const currentItem = getCurrentContent();

    useEffect(() => {
        if (!currentItem || !currentItem.text || currentItem.text.length < 10) {
            setCritique(null);
            return;
        }

        // Don't re-analyze identical content unless persona changed
        if (currentItem.text === lastAnalyzed && critique?.persona === persona) {
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const result = await critiqueContent(currentItem.type, currentItem.text, persona);
                setCritique(result);
                setLastAnalyzed(currentItem.text);
                // Auto-open if specific criteria met? Nah, let's keep it manual open or just show notification dot
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }, 1500); // Debounce 1.5s

        return () => clearTimeout(timer);
    }, [currentItem?.text, currentItem?.type, persona]);

    if (!currentItem) return null; // Don't show on steps without text critique

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
            {/* Expanded Card */}
            {isOpen && (
                <div className="w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">AI Facilitator</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-4">
                        {isLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        ) : critique ? (
                            <div className="space-y-4">
                                {/* Score */}
                                <div className="flex items-center gap-3">
                                    <div className={`relative w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg border-4 ${critique.score > 80 ? 'border-green-500 text-green-600' :
                                        critique.score > 50 ? 'border-amber-500 text-amber-600' :
                                            'border-red-500 text-red-600'
                                        }`}>
                                        {critique.score}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Quality Score</div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {critique.score > 80 ? 'Excellent' : critique.score > 50 ? 'Good start' : 'Needs work'}
                                        </div>
                                    </div>
                                </div>

                                {/* Suggestion */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                                    <p className="flex gap-2">
                                        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                                        {critique.suggestion}
                                    </p>
                                </div>

                                {/* Strengths & Weaknesses */}
                                <div className="space-y-2">
                                    {critique.strengths.length > 0 && (
                                        <div className="text-xs">
                                            <span className="font-bold text-green-600 flex items-center gap-1 mb-1">
                                                <ThumbsUp className="w-3 h-3" /> Strong Points
                                            </span>
                                            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 pl-1">
                                                {critique.strengths.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {critique.weaknesses.length > 0 && (
                                        <div className="text-xs">
                                            <span className="font-bold text-red-600 flex items-center gap-1 mb-1">
                                                <ThumbsDown className="w-3 h-3" /> Weak Points
                                            </span>
                                            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 pl-1">
                                                {critique.weaknesses.slice(0, 2).map((w, i) => <li key={i}>{w}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-sm text-slate-500 py-4">
                                Type something to get feedback...
                            </div>
                        )}
                    </div>

                    {/* Persona Toggle */}
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-1">
                        {(['Analyst', 'Skeptic', 'Fan'] as PersonaType[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPersona(p)}
                                className={`flex-1 text-xs py-1.5 rounded font-medium transition-colors ${persona === p
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${critique && critique.score < 50 ? 'bg-amber-500 hover:bg-amber-600' :
                    'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600'
                    }`}
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Bot className="w-7 h-7 text-white" />
                        {/* Notification Dot if critique is ready and not open */}
                        {!isOpen && critique && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        )}
                    </>
                )}

                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        AI Facilitator
                    </div>
                )}
            </button>
        </div>
    );
}

// Add global styles for animation if not present
// animate-in slide-in-from-bottom-5 fade-in duration-200 are Tailwind CSS classes 
// but require tailwindcss-animate plugin or standard arbitrary values.
// Standard arbitrary values would be: 
// animate-[slideIn_0.2s_ease-out]
// We'll rely on the standard transition classes we used.
