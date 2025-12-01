

interface GraphToolbarProps {
    onAddNode: (type: string) => void;
    onFit: () => void;
    onTogglePhysics: () => void;
    physicsEnabled: boolean;
}

export function GraphToolbar({ onAddNode, onFit, onTogglePhysics, physicsEnabled }: GraphToolbarProps) {
    return (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-md border border-slate-200 dark:border-slate-700 flex gap-2">
                <button
                    onClick={onFit}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                    title="Fit View"
                >
                    🔍 Fit
                </button>
                <button
                    onClick={onTogglePhysics}
                    className={`p-1.5 rounded text-slate-600 dark:text-slate-300 ${physicsEnabled ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    title="Toggle Physics"
                >
                    ⚛️ Physics
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-md border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                <div className="text-xs font-semibold text-slate-500 mb-1 px-1">Add Entity</div>
                {['Value', 'Principle', 'Behavior', 'Goal'].map(type => (
                    <button
                        key={type}
                        onClick={() => onAddNode(type.toLowerCase())}
                        className="text-left px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300"
                    >
                        + {type}
                    </button>
                ))}
            </div>
        </div>
    );
}
