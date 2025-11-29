import { Button } from './ui/Button';
import { LayoutGrid, Network } from 'lucide-react';

type ViewMode = 'canvas' | 'graph';

interface ViewToggleProps {
    currentView: ViewMode;
    onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <Button
                variant={currentView === 'canvas' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('canvas')}
                className="gap-2"
            >
                <LayoutGrid className="h-4 w-4" />
                Canvas
            </Button>
            <Button
                variant={currentView === 'graph' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('graph')}
                className="gap-2"
            >
                <Network className="h-4 w-4" />
                Graph
            </Button>
        </div>
    );
}
