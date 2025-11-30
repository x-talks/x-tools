import { useWizard } from '../core/store';
import { SemanticRelationshipGraph } from './SemanticRelationshipGraph';
import { Network } from 'lucide-react';

export function OntologyView() {
    const { state } = useWizard();

    // Check if we have enough data to show a meaningful graph
    const hasData = state.values.length > 0 || state.principles.length > 0 || state.behaviors.length > 0;

    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 h-64">
                <Network className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Ontology Not Yet Available</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-xs">
                    Start adding Values, Principles, or Behaviors to visualize your team's semantic architecture.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Ontology View</h3>
                <span className="text-xs text-slate-500">Live Semantic Graph</span>
            </div>
            <SemanticRelationshipGraph className="h-[400px]" />
        </div>
    );
}
