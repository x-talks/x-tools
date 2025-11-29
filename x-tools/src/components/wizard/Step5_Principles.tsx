import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { PRINCIPLE_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { SideNote } from '../ui/SideNote';
import { Button } from '../ui/Button';
import { Plus, Trash2, Wand2, Sparkles } from 'lucide-react';
import type { Principle } from '../../core/types';
import AI from '../../core/ai';

export function Step5_Principles() {
    const { state, dispatch } = useWizard();
    const [principles, setPrinciples] = useState<Principle[]>(state.principles);
    const [newPrincipleText, setNewPrincipleText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Pre-fill with example if empty
    useEffect(() => {
        if (principles.length === 0 && state.principles.length === 0) {
            // Pick 3 random principles
            const randomPrinciples = [...PRINCIPLE_TEMPLATES].sort(() => 0.5 - Math.random()).slice(0, 3);
            setPrinciples(randomPrinciples.map((text, i) => ({
                id: `prin-${Date.now()}-${i}`,
                label: text,
                derivedFrom: []
            })));
        }
    }, []);

    const handleAddPrinciple = () => {
        if (!newPrincipleText.trim()) return;
        const newPrinciple: Principle = {
            id: `prin-${Date.now()}`,
            label: newPrincipleText,
            derivedFrom: []
        };
        setPrinciples([...principles, newPrinciple]);
        setNewPrincipleText('');
    };

    const handleRemovePrinciple = (id: string) => {
        setPrinciples(principles.filter(p => p.id !== id));
    };

    const handleNext = () => {
        dispatch({ type: 'SET_PRINCIPLES', payload: principles });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleAutoFill = () => {
        const randomPrinciples = [...PRINCIPLE_TEMPLATES].sort(() => 0.5 - Math.random()).slice(0, 3);
        setPrinciples(randomPrinciples.map((text, i) => ({
            id: `prin-${Date.now()}-${i}`,
            label: text,
            derivedFrom: []
        })));
    };

    const handleAISuggest = async () => {
        setIsGenerating(true);
        try {
            const values = state.values.map(v => v.label);
            // Pass current principles to avoid duplicates or provide context if possible
            // For now, we rely on values as the primary driver, but we append results.
            const suggestions = await AI.suggestPrinciples(values);

            const newPrinciples = suggestions.map((text, i) => ({
                id: `prin-ai-${Date.now()}-${i}`,
                label: text,
                derivedFrom: []
            }));

            setPrinciples(prev => [...prev, ...newPrinciples]);
        } catch (error) {
            console.error('AI Suggestion failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Step 5: Principles</CardTitle>
                <p className="text-sm text-slate-500">How we think and decide.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <SideNote content={WIZARD_CONTENT.Principle} />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Principles</h4>
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

                    {principles.map((principle) => (
                        <div key={principle.id} className="flex items-center gap-2 bg-slate-50 p-3 rounded-md group">
                            <span className="flex-1 text-sm">{principle.label}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePrinciple(principle.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <div className="flex items-center gap-2 mt-4">
                        <input
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            placeholder="Add a principle..."
                            value={newPrincipleText}
                            onChange={(e) => setNewPrincipleText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddPrinciple()}
                        />
                        <Button variant="secondary" onClick={handleAddPrinciple} disabled={!newPrincipleText.trim()}>
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => dispatch({ type: 'PREV_STEP' })}>Back</Button>
                <Button onClick={handleNext}>Next: Behaviors</Button>
            </CardFooter>
        </Card >
    );
}
