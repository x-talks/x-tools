import { Rocket, Shield, Heart, Palette } from 'lucide-react';
import { TEMPLATES, Template } from '../../core/templates';

// Map string icon names to components
const IconMap: Record<string, any> = {
    'Rocket': Rocket,
    'Shield': Shield,
    'Heart': Heart,
    'Palette': Palette
};

interface TemplatePickerProps {
    onSelect: (template: Template) => void;
    onCancel: () => void;
}

export function TemplatePicker({ onSelect, onCancel }: TemplatePickerProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Choose a Starting Point
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Select a template that best matches your team's DNA. You can customize everything later.
                    </p>
                </div>

                {/* Grid */}
                <div className="p-8 overflow-y-auto bg-slate-100 dark:bg-slate-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {TEMPLATES.map((template: Template) => {
                            const Icon = IconMap[template.icon] || Rocket;

                            return (
                                <button
                                    key={template.id}
                                    onClick={() => onSelect(template)}
                                    className="group relative flex flex-col text-left bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Select
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 min-h-[40px]">
                                        {template.description}
                                    </p>

                                    {/* Preview Content */}
                                    <div className="mt-auto space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span className="truncate max-w-[280px]">"{template.data.teamPurpose}"</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {template.data.values.slice(0, 3).map((val: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-700/50 rounded text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                    {val}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
                    <button
                        onClick={onCancel}
                        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium transition-colors"
                    >
                        Start from Scratch instead
                    </button>
                </div>
            </div>
        </div>
    );
}
