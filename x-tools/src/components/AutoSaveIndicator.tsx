import { Check, AlertCircle, Loader2, Cloud } from 'lucide-react';
import { useAutoSave } from '../hooks/useAutoSave';

export function AutoSaveIndicator() {
    const { saveStatus, lastSaved, error } = useAutoSave();

    const formatLastSaved = (date: Date | null) => {
        if (!date) return '';

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);

        if (diffSec < 10) return 'just now';
        if (diffSec < 60) return `${diffSec}s ago`;
        if (diffMin < 60) return `${diffMin}m ago`;

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-xs">
            {saveStatus === 'saving' && (
                <>
                    <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Saving...</span>
                </>
            )}

            {saveStatus === 'saved' && (
                <>
                    <div className="relative">
                        <Cloud className="w-3.5 h-3.5 text-green-500" />
                        <Check className="w-2 h-2 text-white absolute top-0.5 left-0.5" />
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                        Saved {formatLastSaved(lastSaved)}
                    </span>
                </>
            )}

            {saveStatus === 'error' && (
                <>
                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-red-600 dark:text-red-400 font-medium" title={error || undefined}>
                        Save failed
                    </span>
                </>
            )}

            {saveStatus === 'idle' && lastSaved && (
                <>
                    <Cloud className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-400">
                        Saved {formatLastSaved(lastSaved)}
                    </span>
                </>
            )}

            {saveStatus === 'idle' && !lastSaved && (
                <>
                    <Cloud className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-slate-400 dark:text-slate-500">
                        Not saved
                    </span>
                </>
            )}
        </div>
    );
}
