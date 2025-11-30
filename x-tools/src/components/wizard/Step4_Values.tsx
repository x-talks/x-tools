import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { VALUES_LIST, WIZARD_CONTENT } from '../../core/rules';
import { WizardStepLayout } from './WizardStepLayout';
import { SemanticTags } from '../SemanticTags';
import { X } from 'lucide-react';
import type { Value } from '../../core/types';
import { useLibrary } from '../../hooks/useLibrary';
import AI from '../../core/ai';

export function Step4_Values() {
    const { state, dispatch } = useWizard();
    const [selectedValues, setSelectedValues] = useState<Value[]>(state.values);
    const { items: libraryItems, addToLibrary } = useLibrary('values', VALUES_LIST as Value[]);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Pre-fill with examples if empty
    useEffect(() => {
        if (selectedValues.length === 0 && state.values.length === 0) {
            // Pick 3 random values
            const shuffled = [...libraryItems].sort(() => 0.5 - Math.random());
            setSelectedValues(shuffled.slice(0, 3).map(v => ({
                ...v,
                source: 'system',
                explanation: 'Suggested value'
            })));
        }
    }, []);

    const handleAdd = (text: string) => {
        // Check if already selected
        if (selectedValues.some(v => v.label.toLowerCase() === text.toLowerCase())) return;

        const newValue: Value = {
            id: `val-custom-${Date.now()}`,
            label: text.trim(),
            description: 'Custom value',
            source: 'user',
            explanation: 'Custom value'
        };
        if (selectedValues.length < 5) {
            setSelectedValues([...selectedValues, newValue]);
        }
    };

    const handleRemove = (id: string) => {
        setSelectedValues(selectedValues.filter(v => v.id !== id));
    };

    const handleReorder = (items: Value[]) => {
        setSelectedValues(items);
    };

    const handleNext = () => {
        dispatch({ type: 'SET_VALUES', payload: selectedValues });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const shuffled = [...libraryItems].sort(() => 0.5 - Math.random());
        setSelectedValues(shuffled.slice(0, 3).map(v => ({
            ...v,
            source: 'system',
            explanation: 'Suggested value'
        })));
    };

    const handleAISuggest = async () => {
        setIsGeneratingAI(true);
        try {
            const suggestions = await AI.suggestValues(
                state.team?.teamPurpose
            );
            const newValues = suggestions.map((label, i) => ({
                id: `val-ai-${Date.now()}-${i}`,
                label,
                description: 'AI suggested core value',
                source: 'system' as const,
                explanation: 'AI Suggested'
            }));
            setSelectedValues(prev => [...prev, ...newValues].slice(0, 5)); // Max 5 values
        } catch (error) {
            console.error('AI suggestion failed:', error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    return (
        <WizardStepLayout
            title="Step 4: Values"
            description="What we care about most."
            sideNoteContent={WIZARD_CONTENT.Value}
            selectedItems={selectedValues}
            libraryItems={libraryItems}
            onAdd={handleAdd}
            onReorder={handleReorder}
            onAddToLibrary={(text) => addToLibrary({
                id: `val-lib-${Date.now()}`,
                label: text,
                description: 'Custom library value',
                source: 'user',
                explanation: 'Added to library'
            })}
            onAISuggest={handleAISuggest}
            onMagicFill={handleMagicFill}
            renderItem={(val) => (
                <div className="flex items-start gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{val.label}</div>
                        <SemanticTags text={val.label + ' ' + val.explanation} maxTags={2} />
                    </div>
                    <button onClick={() => handleRemove(val.id)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                        <X className="h-4 w-4 text-slate-400" />
                    </button>
                </div>
            )}
            getLabel={(val) => val.label}
            getId={(val) => val.id}
            isGeneratingAI={isGeneratingAI}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'PREV_STEP' })}
            isNextDisabled={selectedValues.length === 0}
            example="Customer Obsession"
        />
    );
}
