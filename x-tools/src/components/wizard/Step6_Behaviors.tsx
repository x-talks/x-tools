import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { BEHAVIOR_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardStepLayout } from './WizardStepLayout';
import { SemanticTags } from '../SemanticTags';
import { X } from 'lucide-react';
import type { Behavior } from '../../core/types';
import AI from '../../core/ai';
import { useLibrary } from '../../hooks/useLibrary';
import { MetadataEditor, Metadata } from '../MetadataEditor';

export function Step6_Behaviors() {
    const { state, dispatch } = useWizard();
    const [behaviors, setBehaviors] = useState<Behavior[]>(state.behaviors);
    const [isGenerating, setIsGenerating] = useState(false);
    const { items: libraryItems, addToLibrary } = useLibrary('behaviors', BEHAVIOR_TEMPLATES);

    // Pre-fill with example if empty
    useEffect(() => {
        if (behaviors.length === 0 && state.behaviors.length === 0) {
            // Pick 3 random behaviors
            const randomBehaviors = [...libraryItems].sort(() => 0.5 - Math.random()).slice(0, 3);
            setBehaviors(randomBehaviors.map((text, i) => ({
                id: `beh-${Date.now()}-${i}`,
                label: text,
                derivedFromValues: [],
                explanation: 'Manually added',
                ruleId: 'MANUAL'
            })));
        }
    }, []);

    // Real-time update with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            // Check for deep equality to avoid loops
            const currentBehaviors = state.behaviors;
            if (JSON.stringify(currentBehaviors) !== JSON.stringify(behaviors)) {
                dispatch({ type: 'SET_BEHAVIORS', payload: behaviors });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [behaviors, state.behaviors, dispatch]);

    const handleAdd = (text: string) => {
        if (behaviors.some(b => b.label.toLowerCase() === text.toLowerCase())) return;

        const newBehavior: Behavior = {
            id: `beh-${Date.now()}`,
            label: text.trim(),
            derivedFromValues: [],
            explanation: 'Manually added',
            ruleId: 'MANUAL'
        };
        setBehaviors([...behaviors, newBehavior]);
    };

    const handleRemove = (id: string) => {
        setBehaviors(behaviors.filter(b => b.id !== id));
    };

    const handleReorder = (items: Behavior[]) => {
        setBehaviors(items);
    };

    const handleUpdateMetadata = (id: string, metadata: Metadata) => {
        setBehaviors(prev => prev.map(b => {
            if (b.id === id) {
                return {
                    ...b,
                    description: metadata.description,
                    tags: metadata.tags
                };
            }
            return b;
        }));
    };

    const handleGenerateMetadata = async (id: string, label: string) => {
        try {
            console.log('Generating metadata for behavior:', label);
            const principles = state.principles.map(p => p.label).join(', ');
            const generated = await AI.generateMetadata('Behavior', label, `Principles: ${principles}`);

            setBehaviors(prev => prev.map(b => {
                if (b.id === id) {
                    return {
                        ...b,
                        description: generated.description,
                        tags: generated.tags
                    };
                }
                return b;
            }));
        } catch (error) {
            console.error('Failed to generate metadata:', error);
        }
    };

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const randomBehaviors = [...libraryItems].sort(() => 0.5 - Math.random()).slice(0, 3);
        setBehaviors(randomBehaviors.map((text, i) => ({
            id: `beh-${Date.now()}-${i}`,
            label: text,
            derivedFromValues: [],
            explanation: 'Manually added',
            ruleId: 'MANUAL'
        })));
    };

    const handleAISuggest = async () => {
        setIsGenerating(true);
        try {
            const values = state.values.map(v => v.label);
            const principles = state.principles.map(p => p.label);

            // Use the first principle + values context
            // We pass current context to ensure additive suggestions
            const contextPrinciple = principles[0] || 'General Team Culture';
            const suggestions = await AI.suggestBehaviors(contextPrinciple, values);

            const newBehaviors = suggestions.map((text, i) => ({
                id: `beh-ai-${Date.now()}-${i}`,
                label: text,
                derivedFromValues: [],
                explanation: 'AI Suggested',
                ruleId: 'AI'
            }));

            setBehaviors(prev => [...prev, ...newBehaviors]);
        } catch (error) {
            console.error('AI Suggestion failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <WizardStepLayout
            title="Step 6: Behaviors"
            description="How we act visibly."
            sideNoteContent={WIZARD_CONTENT.Behavior}
            selectedItems={behaviors}
            libraryItems={libraryItems.map((b, i) => ({
                id: `lib-${i}`,
                label: b,
                derivedFromValues: [],
                explanation: '',
                ruleId: 'LIBRARY'
            }))}
            onAdd={handleAdd}
            onReorder={handleReorder}
            onAddToLibrary={addToLibrary}
            onAISuggest={handleAISuggest}
            onMagicFill={handleMagicFill}
            renderItem={(b) => (
                <div className="flex flex-col p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-start gap-2">
                        <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-slate-100">{b.label}</div>
                            <SemanticTags text={b.label + ' ' + (b.explanation || '')} maxTags={2} />
                        </div>
                        <button onClick={() => handleRemove(b.id)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                            <X className="h-4 w-4 text-slate-400" />
                        </button>
                    </div>
                    <MetadataEditor
                        id={b.id}
                        description={b.description}
                        tags={b.tags}
                        onUpdate={(meta) => handleUpdateMetadata(b.id, meta)}
                        onGenerateWithAI={() => handleGenerateMetadata(b.id, b.label)}
                        entityType="Behavior"
                    />
                </div>
            )}
            getLabel={(b) => b.label}
            getId={(b) => b.id}
            isGeneratingAI={isGenerating}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'PREV_STEP' })}
            isNextDisabled={behaviors.length === 0}
            example="We disagree and commit."
        />
    );
}
