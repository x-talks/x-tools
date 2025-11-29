import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { BEHAVIOR_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { SideNote } from '../ui/SideNote';
import { Button } from '../ui/Button';
import { Plus, Trash2, Wand2, Sparkles } from 'lucide-react';
import type { Behavior } from '../../core/types';
import AI from '../../core/ai';

export function Step6_Behaviors() {
    const { state, dispatch } = useWizard();
    const [behaviors, setBehaviors] = useState<Behavior[]>(state.behaviors);
    const [newBehaviorText, setNewBehaviorText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Pre-fill with example if empty
    useEffect(() => {
        if (behaviors.length === 0 && state.behaviors.length === 0) {
            // Pick 3 random behaviors
            const randomBehaviors = [...BEHAVIOR_TEMPLATES].sort(() => 0.5 - Math.random()).slice(0, 3);
            setBehaviors(randomBehaviors.map((text, i) => ({
                id: `beh-${Date.now()}-${i}`,
                label: text,
                derivedFromValues: [],
                explanation: 'Manually added',
                ruleId: 'MANUAL'
            })));
        }
    }, []);

    const handleNext = () => {
        dispatch({ type: 'SET_BEHAVIORS', payload: behaviors });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleAddBehavior = () => {
        if (!newBehaviorText.trim()) return;
        const newBehavior: Behavior = {
            id: `beh-${Date.now()}`,
            label: newBehaviorText,
            derivedFromValues: [],
            explanation: 'Manually added',
            ruleId: 'MANUAL'
        };
        setBehaviors([...behaviors, newBehavior]);
        setNewBehaviorText('');
    };

    const handleRemoveBehavior = (id: string) => {
        setBehaviors(behaviors.filter(b => b.id !== id));
    };

    const handleAutoFill = () => {
        const randomBehaviors = [...BEHAVIOR_TEMPLATES].sort(() => 0.5 - Math.random()).slice(0, 3);
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
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Step 6: Behaviors</CardTitle>
                <p className="text-sm text-slate-500">How we act visibly.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <SideNote content={WIZARD_CONTENT.Behavior} />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Behaviors</h4>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAISuggest}
                                disabled={isGenerating || state.values.length === 0}
                                className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                                <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                                {isGenerating ? 'Thinking...' : 'AI Suggest'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleAutoFill} title="Magic Fill">
                                <Wand2 className="h-4 w-4 text-slate-400" />
                            </Button>
                        </div>
                    </div>

                    {behaviors.map((behavior) => (
                        <div key={behavior.id} className="flex items-center gap-2 bg-slate-50 p-3 rounded-md group">
                            <span className="flex-1 text-sm">{behavior.label}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveBehavior(behavior.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <div className="flex items-center gap-2 mt-4">
                        <input
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            placeholder="Add a behavior..."
                            value={newBehaviorText}
                            onChange={(e) => setNewBehaviorText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddBehavior()}
                        />
                        <Button variant="secondary" onClick={handleAddBehavior} disabled={!newBehaviorText.trim()}>
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => dispatch({ type: 'PREV_STEP' })}>Back</Button>
                <Button onClick={handleNext}>Next: Goals</Button>
            </CardFooter>
        </Card >
    );
}
