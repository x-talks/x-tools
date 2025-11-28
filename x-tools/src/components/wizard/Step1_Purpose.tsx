import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { PURPOSE_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { SideNote } from '../ui/SideNote';
import { Button } from '../ui/Button';
import { Wand2 } from 'lucide-react';

export function Step1_Purpose() {
    const { state, dispatch } = useWizard();
    const [purpose, setPurpose] = useState(state.team?.teamPurpose || '');

    // Pre-fill with example if empty
    useEffect(() => {
        if (!purpose && !state.team?.teamPurpose) {
            const randomPurpose = PURPOSE_TEMPLATES[Math.floor(Math.random() * PURPOSE_TEMPLATES.length)];
            setPurpose(randomPurpose);
        }
    }, []);

    const handleNext = () => {
        dispatch({
            type: 'SET_TEAM',
            payload: {
                ...state.team!,
                teamPurpose: purpose
            }
        });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleAutoFill = () => {
        const randomPurpose = PURPOSE_TEMPLATES[Math.floor(Math.random() * PURPOSE_TEMPLATES.length)];
        setPurpose(randomPurpose);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Step 1: Purpose</CardTitle>
                <p className="text-sm text-slate-500">Why we exist.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <SideNote content={WIZARD_CONTENT.Purpose} />

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">Team Purpose</label>
                        <Button variant="ghost" size="sm" onClick={handleAutoFill} title="Magic Fill">
                            <Wand2 className="h-4 w-4 text-purple-500" />
                        </Button>
                    </div>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        placeholder="Describe why your team exists..."
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => dispatch({ type: 'PREV_STEP' })}>Back</Button>
                <Button onClick={handleNext} disabled={!purpose.trim()}>Next: Vision</Button>
            </CardFooter>
        </Card>
    );
}
