import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { GOAL_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardStepLayout } from './WizardStepLayout';
import { SemanticTags } from '../SemanticTags';
import { X, Target, BarChart2, TrendingUp } from 'lucide-react';
import type { Goal } from '../../core/types';
import AI from '../../core/ai';
import { useLibrary } from '../../hooks/useLibrary';
import { MetadataEditor, Metadata } from '../MetadataEditor';

export function Step7_Goals() {
    const { state, dispatch } = useWizard();
    const [goals, setGoals] = useState<Goal[]>(state.goals);
    const { items: libraryItems, addToLibrary } = useLibrary('goals', GOAL_TEMPLATES);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Initialize with placeholders if empty (Feature 2: Smart Defaults)
    useEffect(() => {
        if (goals.length === 0 && (!state.goals || state.goals.length === 0)) {
            // No default fill for now to avoid clutter, let user choose
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

        // Auto-detect type based on keywords like "increase", "reduce", "%", "number"
        const isKR = /\d|increase|reduce|maintain|score/.test(text.toLowerCase());

        const newGoal: Goal = {
            id: `goal-${Date.now()}`,
            text: text,
            description: '',
            tags: [],
            type: isKR ? 'key_result' : 'objective',
            progress: 0,
            metric: isKR ? { current: 0, target: 100, unit: '%' } : undefined
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

    const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    };

    const handleGenerateMetadata = async (id: string, text: string) => {
        try {
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
            tags: [],
            type: 'objective',
            progress: 0
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
                tags: [],
                type: /\d|%/.test(text) ? 'key_result' as const : 'objective' as const,
                progress: 0
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
            title="Step 7: OKRs & Goals"
            description="Define Objectives and Key Results to measure success."
            sideNoteContent={WIZARD_CONTENT.Goals}
            selectedItems={goals}
            libraryItems={libraryItems.map((g, i) => ({
                id: `lib-${i}`,
                text: g,
                description: '',
                tags: [],
                type: 'objective',
                progress: 0
            }))}
            onAdd={handleAdd}
            onReorder={handleReorder}
            onAddToLibrary={addToLibrary}
            onAISuggest={handleAISuggest}
            onMagicFill={handleMagicFill}
            renderItem={(g) => (
                <div className={`flex flex-col p-4 border rounded-lg transition-all ${g.type === 'objective'
                        ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ml-6'
                    }`}>
                    <div className="flex items-start gap-3">
                        <div className={`mt-1 bg-white dark:bg-slate-900 p-1.5 rounded-full shadow-sm border ${g.type === 'objective' ? 'border-blue-200 text-blue-600' : 'border-emerald-200 text-emerald-600'
                            }`}>
                            {g.type === 'objective' ? <Target className="w-4 h-4" /> : <BarChart2 className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 w-full mr-4">
                                    <input
                                        type="text"
                                        value={g.text}
                                        onChange={(e) => handleUpdateGoal(g.id, { text: e.target.value })}
                                        className="bg-transparent font-medium text-slate-900 dark:text-slate-100 w-full border-none p-0 focus:ring-0"
                                    />
                                </div>
                                <button onClick={() => handleRemove(g.id)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                                    <X className="h-4 w-4 text-slate-400" />
                                </button>
                            </div>

                            {/* Feature 7: Metric Tracking & Progress */}
                            {g.type === 'key_result' && (
                                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <span>Initial: 0</span>
                                    </div>
                                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${g.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{g.progress}%</span>
                                        <button
                                            onClick={() => handleUpdateGoal(g.id, { progress: Math.min(100, g.progress + 10) })}
                                            className="hover:text-emerald-500"
                                        >
                                            <TrendingUp className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Type Toggle Badge */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateGoal(g.id, { type: g.type === 'objective' ? 'key_result' : 'objective' })}
                                    className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${g.type === 'objective'
                                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                        }`}
                                >
                                    {g.type === 'objective' ? 'Objective' : 'Key Result'}
                                </button>
                                <SemanticTags text={g.text} maxTags={2} />
                            </div>
                        </div>
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
            example="Achieve 99.9% uptime (KR) or Dominate the Market (Objective)"
        />
    );
}
