import { useWizard } from '../core/store';
import { buildOntologyGraph, ConflictSeverity } from '../core/ontology';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useState } from 'react';

export function ConflictWarningBanner() {
    const { state } = useWizard();
    const graph = buildOntologyGraph(state);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    const activeConflicts = graph.conflicts.filter(c => !dismissed.has(c.id));

    if (activeConflicts.length === 0) return null;

    const getSeverityIcon = (severity: ConflictSeverity) => {
        switch (severity) {
            case ConflictSeverity.CRITICAL_CONFLICT:
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case ConflictSeverity.POTENTIAL_CONFLICT:
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case ConflictSeverity.HEALTHY_TENSION:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getSeverityColor = (severity: ConflictSeverity) => {
        switch (severity) {
            case ConflictSeverity.CRITICAL_CONFLICT:
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case ConflictSeverity.POTENTIAL_CONFLICT:
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            case ConflictSeverity.HEALTHY_TENSION:
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        }
    };

    const getSeverityTitle = (severity: ConflictSeverity) => {
        switch (severity) {
            case ConflictSeverity.CRITICAL_CONFLICT:
                return 'Critical Conflict Detected';
            case ConflictSeverity.POTENTIAL_CONFLICT:
                return 'Potential Conflict';
            case ConflictSeverity.HEALTHY_TENSION:
                return 'Healthy Tension';
        }
    };

    const handleDismiss = (conflictId: string) => {
        setDismissed(prev => new Set([...prev, conflictId]));
    };

    return (
        <div className="space-y-3">
            {activeConflicts.map(conflict => (
                <div
                    key={conflict.id}
                    className={`relative p-4 rounded-lg border-2 ${getSeverityColor(conflict.severity)}`}
                >
                    <button
                        onClick={() => handleDismiss(conflict.id)}
                        className="absolute top-2 right-2 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        title="Dismiss"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="flex items-start gap-3 pr-8">
                        <div className="flex-shrink-0 mt-0.5">
                            {getSeverityIcon(conflict.severity)}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">
                                {getSeverityTitle(conflict.severity)}: {conflict.dimension}
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                                {conflict.explanation}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div className="p-2 bg-white/50 dark:bg-black/20 rounded border border-slate-200 dark:border-slate-700">
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                                        {conflict.item1.type}
                                    </div>
                                    <div className="text-sm text-slate-900 dark:text-slate-100">
                                        "{conflict.item1.text}"
                                    </div>
                                </div>
                                <div className="p-2 bg-white/50 dark:bg-black/20 rounded border border-slate-200 dark:border-slate-700">
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                                        {conflict.item2.type}
                                    </div>
                                    <div className="text-sm text-slate-900 dark:text-slate-100">
                                        "{conflict.item2.text}"
                                    </div>
                                </div>
                            </div>

                            {conflict.suggestedResolution && (
                                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                                    <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                                        💡 Suggested Resolution
                                    </div>
                                    <div className="text-sm text-green-900 dark:text-green-200">
                                        {conflict.suggestedResolution}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
