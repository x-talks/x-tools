import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { PRINCIPLE_LIBRARY, WIZARD_CONTENT } from '../../core/rules';
import { WizardStepLayout } from './WizardStepLayout';
import { SemanticTags } from '../SemanticTags';
import { X } from 'lucide-react';
import type { Principle } from '../../core/types';
import AI from '../../core/ai';
import { useLibrary } from '../../hooks/useLibrary';
import { MetadataEditor, Metadata } from '../MetadataEditor';

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
            const currentPrinciples = state.principles;
            if (JSON.stringify(currentPrinciples) !== JSON.stringify(principles)) {
                dispatch({ type: 'SET_PRINCIPLES', payload: principles });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [principles, state.principles, dispatch]);

    const handleAdd = (text: string) => {
        if (principles.some(p => p.label.toLowerCase() === text.toLowerCase())) return;

        const newPrinciple: Principle = {
            id: `prin-${Date.now()}`,
            label: text.trim(),
            derivedFromValues: [],
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

    const handleUpdateMetadata = (id: string, metadata: Metadata) => {
        setPrinciples(prev => prev.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    description: metadata.description,
                    tags: metadata.tags
                };
            }
            return p;
        }));
    };

    const handleGenerateMetadata = async (id: string, label: string) => {
        try {
            console.log('Generating metadata for principle:', label);
            const values = state.values.map(v => v.label).join(', ');
            const generated = await AI.generateMetadata('Principle', label, `Values: ${values}`);

            setPrinciples(prev => prev.map(p => {
                if (p.id === id) {
                    return {
                        ...p,
                        description: generated.description,
                        tags: generated.tags
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error('Failed to generate metadata:', error);
        }
    };

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const randomPrinciples = [...libraryItems].sort(() => 0.5 - Math.random()).slice(0, 3);
        setPrinciples(randomPrinciples.map((text, i) => ({
            id: `prin-${Date.now()}-${i}`,
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
            const suggestions = await AI.suggestPrinciples(values);

            const newPrinciples = suggestions.map((text, i) => ({
                id: `prin-ai-${Date.now()}-${i}`,
                label: text,
                derivedFromValues: [],
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
                derivedFromValues: [],
                explanation: '',
                ruleId: 'LIBRARY'
            }))}
            onAdd={handleAdd}

            onReorder={handleReorder}
            onAddToLibrary={addToLibrary}
            onAISuggest={handleAISuggest}
            onMagicFill={handleMagicFill}
            renderItem={(p) => (
                <div className="flex flex-col p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-start gap-2">
                        <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-slate-100">{p.label}</div>
                            <SemanticTags text={p.label + ' ' + (p.explanation || '')} maxTags={2} />

                            {/* NEW: Value Selector */}
                            {state.values.length > 0 && (
                                <div className="mt-2">
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Derives from Value:
                                    </label>
                                    <select
                                        value={p.valueId || ''}
                                        onChange={(e) => {
                                            const valueId = e.target.value;
                                            setPrinciples(prev => prev.map(principle =>
                                                principle.id === p.id
                                                    ? { ...principle, valueId: valueId || undefined }
                                                    : principle
                                            ));
                                        }}
                                        className="w-full px-2 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="">-- Select a Value --</option>
                                        {state.values.map(value => (
                                            <option key={value.id} value={value.id}>
                                                {value.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <button onClick={() => handleRemove(p.id)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                            <X className="h-4 w-4 text-slate-400" />
                        </button>
                    </div>
                    <MetadataEditor
                        id={p.id}
                        description={p.description}
                        tags={p.tags}
                        onUpdate={(meta) => handleUpdateMetadata(p.id, meta)}
                        onGenerateWithAI={() => handleGenerateMetadata(p.id, p.label)}
                        entityType="Principle"
                    />
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
