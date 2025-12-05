import { useState } from 'react';
import { useWizard } from '../core/store';
import { TemplateService } from '../core/featureServices';
import { LayoutTemplate, ChevronRight } from 'lucide-react';

export function TemplateSelector() {
    const { dispatch } = useWizard();
    const [isOpen, setIsOpen] = useState(false);

    // Mock industries for now
    const industries = [
        { id: 'tech', label: 'Tech Startup', icon: '🚀' },
        { id: 'enterprise', label: 'Enterprise IT', icon: '🏢' },
        { id: 'creative', label: 'Design Agency', icon: '🎨' },
        { id: 'nonprofit', label: 'Non-Profit', icon: '❤️' }
    ];

    const applyTemplate = (industry: string) => {
        const templates = TemplateService.getTemplates(industry);

        // In a real implementation, we'd map these strings to full objects with IDs
        // For now, we simulate the action by patching the state
        const values = templates.values.map((v, i) => ({
            id: `tpl-val-${i}`,
            label: v,
            explanation: 'Template default',
            source: 'template' as const,
            description: '',
            tags: []
        }));

        const principles = templates.principles.map((p, i) => ({
            id: `tpl-prin-${i}`,
            label: p,
            explanation: 'Template default',
            description: '',
            tags: []
        }));

        dispatch({ type: 'SET_VALUES', payload: values });
        dispatch({ type: 'SET_PRINCIPLES', payload: principles });

        setIsOpen(false);
        // Show success toast or similar
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
                <LayoutTemplate className="w-3.5 h-3.5" />
                Templates
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 mb-1">
                            Select Industry
                        </div>
                        <div className="space-y-1">
                            {industries.map((ind) => (
                                <button
                                    key={ind.id}
                                    onClick={() => applyTemplate(ind.id)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{ind.icon}</span>
                                        <span className="text-slate-700 dark:text-slate-200">{ind.label}</span>
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
