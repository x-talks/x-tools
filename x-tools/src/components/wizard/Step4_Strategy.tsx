import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { STRATEGY_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { SideNote } from '../ui/SideNote';
import { Button } from '../ui/Button';
import { Wand2 } from 'lucide-react';

export function Step4_Strategy() {
    const { state, dispatch } = useWizard();
    const [strategyText, setStrategyText] = useState(state.strategy?.text || '');

    // Pre-fill with example if empty
    useEffect(() => {
        if (!strategyText && !state.strategy?.text) {
            handleAutoFill();
        }
    }, []);

    const handleNext = () => {
        dispatch({
            type: 'SET_STRATEGY',
            payload: {
                text: strategyText
            }
        });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleAutoFill = () => {
        const randomItem = STRATEGY_TEMPLATES[Math.floor(Math.random() * STRATEGY_TEMPLATES.length)];
        setStrategyText(randomItem.Strategy);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Step 4: Strategy</CardTitle>
                <p className="text-sm text-slate-500">How we win.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <SideNote content={WIZARD_CONTENT.Strategy} />

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">Strategy Statement</label>
                        <Button variant="ghost" size="sm" onClick={handleAutoFill} title="Magic Fill">
                            <Wand2 className="h-4 w-4 text-purple-500" />
                        </Button>
                    </div>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        placeholder="Define your strategy..."
                        value={strategyText}
                        onChange={(e) => setStrategyText(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => dispatch({ type: 'PREV_STEP' })}>Back</Button>
                <Button onClick={handleNext} disabled={!strategyText.trim()}>Next: Values</Button>
            </CardFooter>
        </Card>
    );
}
