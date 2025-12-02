import { X } from 'lucide-react';
import { InteractiveGraph } from './graph/InteractiveGraph';

export interface GraphPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GraphPanel({ isOpen, onClose }: GraphPanelProps) {
    return (
        <div
            className={`fixed right-0 top-0 h-full w-[600px] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            Organization Graph
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Real-time visualization of your team's alignment
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close graph panel"
                    >
                        <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Graph Container */}
                <div className="flex-1 relative bg-slate-50 dark:bg-slate-900">
                    <InteractiveGraph />
                </div>

                {/* Footer with legend */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                        <p className="font-semibold mb-2">Legend:</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-orange-500"></div>
                                <span>Purpose</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-purple-600"></div>
                                <span>Vision</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-sky-500"></div>
                                <span>Mission</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-green-500"></div>
                                <span>Strategy</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-pink-500"></div>
                                <span>Values</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-red-500"></div>
                                <span>Principles</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-cyan-500"></div>
                                <span>Behaviors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                                <span>Goals</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
