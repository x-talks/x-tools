import { Maximize2 } from 'lucide-react';

interface GraphToolbarProps {
    onFitView: () => void;
}

export function GraphToolbar({ onFitView }: GraphToolbarProps) {
    return (
        <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2">
            <button
                onClick={onFitView}
                className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm font-medium"
                title="Fit View"
            >
                <Maximize2 className="h-4 w-4" />
                Fit View
            </button>
        </div>
    );
}
