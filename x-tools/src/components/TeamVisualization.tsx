import { useState, useRef } from 'react';
import { useWizard } from '../core/store';
import { ViewToggle } from './ViewToggle';
import { TeamCanvas } from './TeamCanvas';
import { InteractiveGraph } from './graph/InteractiveGraph';
import { TeamHealthDashboard } from './TeamHealthDashboard';
import { ConflictWarningBanner } from './ConflictWarningBanner';
import { Download, Printer } from 'lucide-react';
import { Button } from './ui/Button';
import html2canvas from 'html2canvas';

export function TeamVisualization() {
    const [viewMode, setViewMode] = useState<'canvas' | 'graph'>('canvas');
    const canvasRef = useRef<HTMLDivElement>(null);
    const { state } = useWizard();

    const handleExportPNG = async () => {
        if (!canvasRef.current) return;

        const canvas = await html2canvas(canvasRef.current, {
            backgroundColor: '#ffffff',
            scale: 2
        });

        const link = document.createElement('a');
        link.download = `${state.team?.teamName || 'team'}-canvas.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Conflict Warnings */}
            <ConflictWarningBanner />

            {/* Health Dashboard */}
            <TeamHealthDashboard />

            {/* View Controls */}
            <div className="flex justify-between items-center">
                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
                <div className="flex gap-2">
                    {viewMode === 'canvas' && (
                        <>
                            <Button variant="outline" size="sm" onClick={handleExportPNG} className="gap-2">
                                <Download className="h-4 w-4" />
                                Export PNG
                            </Button>
                            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 print:hidden">
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Visualization */}
            <div ref={canvasRef}>
                {viewMode === 'canvas' ? <TeamCanvas /> : <InteractiveGraph />}
            </div>
        </div>
    );
}
