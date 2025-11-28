import { useState } from 'react';
import { X, Download, Copy } from 'lucide-react';
import { Button } from '../ui/Button';
import { FlowVisualization } from '../visualizations/FlowVisualization';
import { exportToPNG, exportToJSON, copyToClipboard } from '../../core/exportUtils';
import type { CombinedVisualization } from '../../core/visualizer';

interface VisualizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: CombinedVisualization;
    teamName?: string;
}

export function VisualizationModal({ isOpen, onClose, data, teamName }: VisualizationModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleExportPNG = async () => {
        await exportToPNG('flow-visualization', `${teamName || 'team'}-visualization.png`);
    };

    const handleExportJSON = () => {
        exportToJSON(data, `${teamName || 'team'}-data.json`);
    };

    const handleCopyJSON = async () => {
        const success = await copyToClipboard(data);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-[95vw] h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Team Identity Visualization</h2>
                        <p className="text-sm text-slate-600 mt-1">
                            {teamName && `${teamName} • `}
                            Interactive flow diagram
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCopyJSON}
                            title="Copy JSON to Clipboard"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            {copied ? 'Copied!' : 'Copy JSON'}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleExportJSON}
                            title="Download JSON"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export JSON
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onClose}
                            title="Close"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Visualization Content */}
                <div className="flex-1 relative">
                    <FlowVisualization data={data} onExportPNG={handleExportPNG} />
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                        <div>
                            💡 <strong>Tip:</strong> Drag nodes to reorganize • Scroll to zoom • Click controls for options
                        </div>
                        <div className="text-slate-400">
                            Powered by React Flow
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
