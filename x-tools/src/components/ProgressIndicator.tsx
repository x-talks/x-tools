import { useWizard } from '../core/store';
import { CheckCircle2, Circle } from 'lucide-react';

const STEP_NAMES = [
    'Team Info',
    'Purpose',
    'Vision',
    'Mission',
    'Strategy',
    'Values',
    'Principles',
    'Behaviors',
    'Goals',
    'Export',
    'Save'
];

export function ProgressIndicator() {
    const { state } = useWizard();
    const currentStep = state.currentStep;
    const totalSteps = STEP_NAMES.length;
    const progress = ((currentStep) / totalSteps) * 100;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 py-3">
                {/* Progress Bar */}
                <div className="mb-2">
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center justify-between text-xs">
                    {STEP_NAMES.map((name, idx) => {
                        const isCompleted = idx < currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-1 transition-all duration-300 ${isCurrent ? 'text-blue-600 dark:text-blue-400 font-semibold scale-110' :
                                        isCompleted ? 'text-green-600 dark:text-green-400' :
                                            'text-slate-400 dark:text-slate-600'
                                    }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                    <Circle className={`w-3.5 h-3.5 ${isCurrent ? 'fill-current' : ''}`} />
                                )}
                                <span className="hidden sm:inline">{name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
