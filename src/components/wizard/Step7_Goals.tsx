import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { GOAL_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { SideNote } from '../ui/SideNote';
import { Button } from '../ui/Button';
import { Plus, Trash2, Wand2 } from 'lucide-react';

export function Step7_Goals() {
    const { state, dispatch } = useWizard();
    const [goals, setGoals] = useState<string[]>(state.goals || []);
    const [customGoal, setCustomGoal] = useState('');

    // Sync local state with store state when it changes (e.g. on load)
    useEffect(() => {
        if (state.goals && state.goals.length > 0) {
            setGoals(state.goals);
        } else if (goals.length === 0) {
            // Pre-fill with examples if empty
            const shuffled = [...GOAL_TEMPLATES].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);
            setGoals(selected);
        }
    }, []);

    const handleNext = () => {
        dispatch({ type: 'SET_GOALS', payload: goals });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleAddGoal = (text: string) => {
        if (goals.includes(text)) return;
        setGoals([...goals, text]);
    };

    const handleRemoveGoal = (text: string) => {
        setGoals(goals.filter(g => g !== text));
    };

    const handleAutoFill = () => {
        const shuffled = [...GOAL_TEMPLATES].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        setGoals(selected);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Step 7: Goals</CardTitle>
                <p className="text-sm text-slate-500">Milestones that prove progress.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <SideNote content={WIZARD_CONTENT.Goals} />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium text-slate-900">Defined Goals</h3>
                        <Button variant="ghost" size="sm" onClick={handleAutoFill} title="Magic Fill">
                            <Wand2 className="h-4 w-4 text-purple-500" />
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            placeholder="Add a custom goal..."
                            value={customGoal}
                            onChange={(e) => setCustomGoal(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && customGoal.trim()) {
                                    handleAddGoal(customGoal.trim());
                                    setCustomGoal('');
                                }
                            }}
                        />
                        <Button onClick={() => {
                            if (customGoal.trim()) {
                                handleAddGoal(customGoal.trim());
                                setCustomGoal('');
                            }
                        }}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {goals.map((g, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                                <span className="text-sm">{g}</span>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveGoal(g)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {goals.length === 0 && (
                            <p className="text-sm text-slate-500 italic">No goals defined yet.</p>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => dispatch({ type: 'PREV_STEP' })}>Back</Button>
                <Button onClick={handleNext}>Next: Roles</Button>
            </CardFooter>
        </Card>
    );
}
