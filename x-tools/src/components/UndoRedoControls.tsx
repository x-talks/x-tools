import { Undo2, Redo2 } from 'lucide-react';
import { useWizard } from '../core/store';

export function UndoRedoControls() {
    const { undo, redo, canUndo, canRedo } = useWizard();

    return (
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-1">
            <button
                onClick={undo}
                disabled={!canUndo}
                className={`p-2 rounded-md transition-all ${canUndo
                        ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    }`}
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
            >
                <Undo2 className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

            <button
                onClick={redo}
                disabled={!canRedo}
                className={`p-2 rounded-md transition-all ${canRedo
                        ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    }`}
                title="Redo (Ctrl+Shift+Z)"
                aria-label="Redo"
            >
                <Redo2 className="w-4 h-4" />
            </button>
        </div>
    );
}
