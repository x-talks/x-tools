import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { PRINCIPLE_LIBRARY, WIZARD_CONTENT } from '../../core/rules';
import { WizardStepLayout } from './WizardStepLayout';
import { X } from 'lucide-react';
import type { Principle } from '../../core/types';
import AI from '../../core/ai';
import { useLibrary } from '../../hooks/useLibrary';

export function Step5_Principles() {
    const { state, dispatch } = useWizard();
    const [principles, setPrinciples] = useState<Principle[]>(state.principles);
    const [isGenerating, setIsGenerating] = useState(false);
    const { items: libraryItems, addToLibrary } = useLibrary('principles', PRINCIPLE_LIBRARY);

    // Pre-fill with example if empty
    useEffect(() => {
        if (principles.length === 0 && state.principles.length === 0) {
            // Pick 3 random principles
            const randomPrinciples = [...libraryItems].sort(() => 0.5 - Math.random()).slice(0, 3);
            setPrinciples(randomPrinciples.map((text, i) => ({
                id: `prin-${Date.now()}-${i}`,
                label: text,
                derivedFrom: [],
                explanation: 'Manually added',
                ruleId: 'MANUAL'
            })));
        }
    }, []);

    const handleAdd = (text: string) => {
        if (principles.some(p => p.label.toLowerCase() === text.toLowerCase())) return;

        const newPrinciple: Principle = {
            id: `prin-${Date.now()}`,
            label: text.trim(),
            derivedFrom: [],
            explanation: 'Manually added',
            ruleId: 'MANUAL'
        };
        setPrinciples([...principles, newPrinciple]);
    };

    const handleRemove = (id: string) => {
        setPrinciples(principles.filter(p => p.id !== id));
    };

    const handleReorder = (items: Principle[]) => {
        setPrinciples(items);
    };

    const handleNext = () => {
        dispatch({ type: 'SET_PRINCIPLES', payload: principles });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const randomPrinciples = [...libraryItems].sort(() => 0.5 - Math.random()).slice(0, 3);
        setPrinciples(randomPrinciples.map((text, i) => ({
            id: `prin-${Date.now()}-${i}`,
            label: text,
            derivedFrom: [],
            explanation: 'Manually added',
            ruleId: 'MANUAL'
        })));
    };

    const handleAISuggest = async () => {
        setIsGenerating(true);
        try {
            const values = state.values.map(v => v.label);
            // Use the first principle + values context
            // We pass current context to ensure additive suggestions
            const suggestions = await AI.suggestPrinciples(values);

            const newPrinciples = suggestions.map((text, i) => ({
                id: `prin-ai-${Date.now()}-${i}`,
                label: text,
                derivedFrom: [],
                explanation: 'AI Suggested',
                ruleId: 'AI'
            }));

            setPrinciples(prev => [...prev, ...newPrinciples]);
        } catch (error) {
            console.error('AI Suggestion failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <WizardStepLayout
            title="Step 5: Principles"
            description="How we make decisions."
            sideNoteContent={WIZARD_CONTENT.Principle}
            selectedItems={principles}
            libraryItems={libraryItems.map((p, i) => ({
                id: `lib-${i}`,
                label: p,
                derivedFrom: [],
                explanation: '',
                ruleId: 'LIBRARY'
            }))}
            onAdd={handleAdd}

            onReorder={handleReorder}
            onAddToLibrary={addToLibrary}
            onAISuggest={handleAISuggest}
            onMagicFill={handleMagicFill}
            renderItem={(p) => (
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-md group w-full">
                    <span className="flex-1 text-sm">{p.label}</span>
                    <button onClick={() => handleRemove(p.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
            getLabel={(p) => p.label}
            getId={(p) => p.id}
            isGeneratingAI={isGenerating}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'PREV_STEP' })}
            isNextDisabled={principles.length === 0}
            example={WIZARD_CONTENT.Principle.Items?.[0]?.Principle || "Data as a Product"}
        />
    );
}
