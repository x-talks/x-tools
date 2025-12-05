import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { GOAL_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardStepLayout } from './WizardStepLayout';
import { SemanticTags } from '../SemanticTags';
import { X } from 'lucide-react';
import type { Goal } from '../../core/types';
import AI from '../../core/ai';
import { useLibrary } from '../../hooks/useLibrary';
import { MetadataEditor, Metadata } from '../MetadataEditor';

export function Step7_Goals() {
    const { state, dispatch } = useWizard();
    const [goals, setGoals] = useState<Goal[]>(state.goals);
    const { items: libraryItems, addToLibrary } = useLibrary('goals', GOAL_TEMPLATES);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    useEffect(() => {
        if (goals.length === 0 && (!state.goals || state.goals.length === 0)) {
            const shuffled = [...libraryItems].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);
            setGoals(selected.map((g, i) => ({
                id: `goal-init-${i}`,
                text: g,
                description: '',
                tags: []
            })));
        }
    }, []);

    // Real-time update with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (JSON.stringify(state.goals) !== JSON.stringify(goals)) {
                dispatch({ type: 'SET_GOALS', payload: goals });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [goals, state.goals, dispatch]);

    const handleAdd = (text: string) => {
        if (goals.some(g => g.text === text)) return;

        const newGoal: Goal = {
            id: `goal-${Date.now()}`,
            text: text,
            description: '',
            tags: []
        };
        setGoals([...goals, newGoal]);
    };

    const handleRemove = (id: string) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const handleReorder = (items: Goal[]) => {
        setGoals(items);
    };

    const handleUpdateMetadata = (id: string, metadata: Metadata) => {
        setGoals(prev => prev.map(g => {
            if (g.id === id) {
                return {
                    ...g,
                    description: metadata.description,
                    tags: metadata.tags
                };
            }
            return g;
        }));
    };

    const handleGenerateMetadata = async (id: string, text: string) => {
        try {
            console.log('Generating metadata for goal:', text);
            // Add context from Strategy and Mission
            const strategy = state.strategy?.text || '';
            const mission = state.mission?.text || '';
            const context = `Strategy: ${strategy}\nMission: ${mission}`;

            const generated = await AI.generateMetadata('Goal', text, context);

            setGoals(prev => prev.map(g => {
                if (g.id === id) {
                    return {
                        ...g,
                        description: generated.description,
                        tags: generated.tags
                    };
                }
                return g;
            }));
        } catch (error) {
            console.error('Failed to generate metadata:', error);
        }
    };

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const shuffled = [...libraryItems].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        setGoals(selected.map((g, i) => ({
            id: `goal-magic-${i}`,
            text: g,
            description: '',
            tags: []
        })));
    };

    const handleAISuggest = async () => {
        setIsGeneratingAI(true);
        try {
            const suggestions = await AI.suggestGoals(
                state.mission?.text,
                state.strategy?.text
            );
            const newGoals = suggestions.map((text, i) => ({
                id: `goal-ai-${Date.now()}-${i}`,
                text,
                description: '',
                tags: []
            }));
            setGoals(prev => [...prev, ...newGoals]);
        } catch (error) {
            console.error('AI suggestion failed:', error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    return (
        <WizardStepLayout
            title="Step 7: Goals"
            description="Milestones that prove progress."
            sideNoteContent={WIZARD_CONTENT.Goals}
            selectedItems={goals}
            libraryItems={libraryItems.map((g, i) => ({
                id: `lib-${i}`,
                text: g,
                description: '',
                tags: []
            }))}
            onAdd={handleAdd}
            onReorder={handleReorder}
            onAddToLibrary={addToLibrary}
            onAISuggest={handleAISuggest}
            onMagicFill={handleMagicFill}
            renderItem={(g) => (
                <div className="flex flex-col p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-start gap-2">
                        <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-slate-100">{g.text}</div>
                            <SemanticTags text={g.text} maxTags={2} />
                        </div>
                        <button onClick={() => handleRemove(g.id)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                            <X className="h-4 w-4 text-slate-400" />
                        </button>
                    </div>
                    <MetadataEditor
                        id={g.id}
                        description={g.description}
                        tags={g.tags}
                        onUpdate={(meta) => handleUpdateMetadata(g.id, meta)}
                        onGenerateWithAI={() => handleGenerateMetadata(g.id, g.text)}
                        entityType="Goal"
                    />
                </div>
            )}
            getLabel={(g) => g.text}
            getId={(g) => g.id}
            isGeneratingAI={isGeneratingAI}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'PREV_STEP' })}
            isNextDisabled={goals.length === 0}
            example="Achieve 99.9% uptime."
        />
    );
}
