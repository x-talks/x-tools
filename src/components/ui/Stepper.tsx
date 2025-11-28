
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

interface StepperProps {
    steps: { title: string; description?: string }[];
    currentStep: number;
    onStepClick?: (index: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
    return (
        <div className="w-full">
            <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full bg-slate-200" />
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col items-center px-2 relative z-10",
                                onStepClick ? "cursor-pointer group" : ""
                            )}
                            onClick={() => onStepClick && onStepClick(index)}
                        >
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 bg-white',
                                    isCompleted
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : isCurrent
                                            ? 'border-blue-600 text-blue-600 scale-110 shadow-md'
                                            : 'border-slate-300 text-slate-300 group-hover:border-slate-400 group-hover:text-slate-400'
                                )}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{index}</span>}
                            </div>
                            <span
                                className={cn(
                                    'mt-2 text-xs font-medium',
                                    isCurrent ? 'text-blue-600' : 'text-slate-500'
                                )}
                            >
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
