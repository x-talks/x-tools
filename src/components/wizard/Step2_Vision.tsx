import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { getVisionArchetypes, VISION_ARCHETYPES, WIZARD_CONTENT } from '../../core/rules';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { SideNote } from '../ui/SideNote';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function Step2_Vision() {
    const { state, dispatch } = useWizard();
    const [visionText, setVisionText] = useState(state.vision?.text || '');
    const [selectedArchetypeId, setSelectedArchetypeId] = useState<string | null>(state.vision?.archetype ? VISION_ARCHETYPES.find(a => a.label === state.vision?.archetype)?.id || null : null);

    const archetypes = getVisionArchetypes([]);

    // Pre-fill with example if empty
    useEffect(() => {
        if (!visionText && !state.vision?.text) {
            const randomArch = archetypes[Math.floor(Math.random() * archetypes.length)];
            setSelectedArchetypeId(randomArch.id);
            setVisionText(randomArch.description);
        }
    }, []);

    const handleSelectArchetype = (arch: typeof archetypes[0]) => {
        setSelectedArchetypeId(arch.id);
        setVisionText(arch.description);
    };

    const handleNext = () => {
        const selectedArch = archetypes.find(a => a.id === selectedArchetypeId);
        dispatch({
            type: 'SET_VISION',
            payload: {
                text: visionText,
                archetype: selectedArch?.label || 'Custom Vision'
            }
        });
        dispatch({ type: 'GO_TO_STEP', payload: 3 }); // Go to Mission
    };

    const handlePrev = () => {
        dispatch({ type: 'GO_TO_STEP', payload: 1 }); // Go to Purpose
    };

    // Sync local state if global state changes (e.g. reload)
    useEffect(() => {
        if (state.vision) {
            setVisionText(state.vision.text);
            if (state.vision.archetype) {
                const arch = VISION_ARCHETYPES.find(a => a.label === state.vision?.archetype);
                if (arch) setSelectedArchetypeId(arch.id);
            }
        }
    }, [state.vision]);

    return (
        <Card className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
                <CardTitle>Step 2: Vision</CardTitle>
                <p className="text-slate-500">What future do we want to create?</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <SideNote content={WIZARD_CONTENT.Vision} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {archetypes.map((arch) => (
                        <button
                            key={arch.id}
                            onClick={() => handleSelectArchetype(arch)}
                            className={cn(
                                "p-4 rounded-lg border text-left transition-all hover:shadow-md",
                                selectedArchetypeId === arch.id
                                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                                    : "border-slate-200 hover:border-orange-300"
                            )}
                        >
                            <div className="font-medium text-slate-900 mb-1">{arch.label}</div>
                            <div className="text-xs text-slate-500 line-clamp-2">{arch.description}</div>
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Your Vision Statement</label>
                    <textarea
                        value={visionText}
                        onChange={(e) => setVisionText(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg min-h-[100px] focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                        placeholder="Describe the future you are building..."
                    />
                    <p className="text-xs text-slate-400">
                        Example: "A world where financial literacy is a universal human right."
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={handlePrev}>Back</Button>
                <Button onClick={handleNext} disabled={!visionText.trim()}>Next: Mission</Button>
            </CardFooter>
        </Card>
    );
}
