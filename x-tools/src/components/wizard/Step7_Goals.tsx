import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { GOAL_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardStepLayout } from './WizardStepLayout';
import { X } from 'lucide-react';
import { useLibrary } from '../../hooks/useLibrary';

export function Step7_Goals() {
    const { state, dispatch } = useWizard();
    const [goals, setGoals] = useState<{ id: string, label: string }[]>(
        (state.goals || []).map((g, i) => ({ id: `goal-${i}`, label: g }))
    );
    const { items: libraryItems, addToLibrary } = useLibrary('goals', GOAL_TEMPLATES);

    useEffect(() => {
        if (goals.length === 0 && (!state.goals || state.goals.length === 0)) {
            const shuffled = [...libraryItems].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);
            setGoals(selected.map((g, i) => ({ id: `goal-init-${i}`, label: g })));
        }
    }, []);

    const handleAdd = (text: string) => {
        if (goals.some(g => g.label === text)) return;
        setGoals([...goals, { id: `goal-${Date.now()}`, label: text }]);
    };

    const handleRemove = (id: string) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const handleReorder = (items: { id: string, label: string }[]) => {
        setGoals(items);
    };

    const handleNext = () => {
        dispatch({ type: 'SET_GOALS', payload: goals.map(g => g.label) });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const shuffled = [...libraryItems].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        setGoals(selected.map((g, i) => ({ id: `goal-magic-${i}`, label: g })));
    };

    return (
        <WizardStepLayout
            title="Step 7: Goals"
            description="Milestones that prove progress."
            sideNoteContent={WIZARD_CONTENT.Goals}
            selectedItems={goals}
            libraryItems={libraryItems.map((g, i) => ({ id: `lib-${i}`, label: g }))}
            onAdd={handleAdd}
            onReorder={handleReorder}
            onAddToLibrary={addToLibrary}
            onAISuggest={() => console.log('AI Suggest')}
            onMagicFill={handleMagicFill}
            renderItem={(g) => (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200 w-full">
                    <span className="text-sm">{g.label}</span>
                    <button onClick={() => handleRemove(g.id)} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
            getLabel={(g) => g.label}
            getId={(g) => g.id}
            isGeneratingAI={false}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'PREV_STEP' })}
            isNextDisabled={goals.length === 0}
            example="Achieve 99.9% uptime."
        />
    );
}
