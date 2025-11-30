import { X, Check, Sparkles } from 'lucide-react';
import { SuggestionOption } from '../core/ai';

interface AISuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: SuggestionOption[];
    onSelect: (text: string) => void;
    title?: string;
}

export function AISuggestionModal({ isOpen, onClose, suggestions, onSelect, title = "AI Suggestions" }: AISuggestionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <Sparkles className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Choose the option that best fits your team's direction. The AI has analyzed your input and structured it according to the formula.
                    </p>

                    <div className="space-y-4">
                        {suggestions.map((option, index) => (
                            <div
                                key={index}
                                className="group relative border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/50"
                                onClick={() => onSelect(option.text)}
                            >
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <p className="text-slate-900 dark:text-slate-100 font-medium text-lg leading-relaxed">
                                        "{option.text}"
                                    </p>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 shadow-sm hover:bg-purple-700">
                                            <Check className="h-4 w-4" /> Select
                                        </button>
                                    </div>
                                </div>

                                {/* Breakdown Visualization */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.entries(option.breakdown).map(([key, value], i) => (
                                        <div key={i} className="flex items-center text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium border-r border-slate-200 dark:border-slate-700">
                                                {key}
                                            </span>
                                            <span className="px-2 py-1 text-purple-700 dark:text-purple-300 font-medium">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
