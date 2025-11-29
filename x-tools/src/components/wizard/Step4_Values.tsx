import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { VALUES_LIST, WIZARD_CONTENT } from '../../core/rules';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { SideNote } from '../ui/SideNote';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { X, Plus } from 'lucide-react';
import { DraggableList } from '../DraggableList';
import { SemanticTags } from '../SemanticTags';
import type { Value } from '../../core/types';

export function Step4_Values() {
    const { state, dispatch } = useWizard();
    const [selectedValues, setSelectedValues] = useState<Value[]>(state.values);
    const [customValue, setCustomValue] = useState('');

    // Pre-fill with examples if empty
    useEffect(() => {
        if (selectedValues.length === 0 && state.values.length === 0) {
            // Pick 3 random values
            const shuffled = [...VALUES_LIST].sort(() => 0.5 - Math.random());
            setSelectedValues(shuffled.slice(0, 3).map(v => ({
                ...v,
                source: 'system',
                explanation: 'Suggested value'
            })));
        }
    }, []);

    const toggleValue = (value: Value) => {
        if (selectedValues.find(v => v.id === value.id)) {
            setSelectedValues(selectedValues.filter(v => v.id !== value.id));
        } else {
            if (selectedValues.length < 5) {
                setSelectedValues([...selectedValues, value]);
            }
        }
    };

    const handleAddCustom = () => {
        if (!customValue.trim()) return;
        const newValue: Value = {
            id: `val-custom-${Date.now()}`,
            label: customValue.trim(),
            description: 'Custom value',
            source: 'user',
            explanation: 'Custom value'
        };
        toggleValue(newValue);
        setCustomValue('');
    };

    const handleNext = () => {
        dispatch({ type: 'SET_VALUES', payload: selectedValues });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handlePrev = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Step 4: Values</CardTitle>
                <p className="text-sm text-slate-500">What we care about most.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <SideNote content={WIZARD_CONTENT.Value} />
                <div className="space-y-2">
                    <p className="text-sm text-slate-500">
                        Choose values that define your team's culture. Select at least 3.
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Your Selected Values (drag to reorder)</h4>
                    {selectedValues.length === 0 ? (
                        <span className="text-sm text-slate-400 italic">No values selected yet.</span>
                    ) : (
                        <DraggableList
                            items={selectedValues.map(val => ({
                                id: val.id,
                                content: (
                                    <div className="flex items-start gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900 dark:text-slate-100">{val.label}</div>
                                            <SemanticTags text={val.label + ' ' + val.explanation} maxTags={2} />
                                        </div>
                                        <button
                                            onClick={() => toggleValue(val)}
                                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                                            title="Remove"
                                        >
                                            <X className="h-4 w-4 text-slate-400" />
                                        </button>
                                    </div>
                                )
                            }))}
                            onReorder={(items) => {
                                const reordered = items.map(item =>
                                    selectedValues.find(v => v.id === item.id)!
                                ).filter(Boolean);
                                setSelectedValues(reordered);
                            }}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Library</h4>
                    <div className="flex flex-wrap gap-2">
                        {VALUES_LIST.map((val) => {
                            const isSelected = selectedValues.some(v => v.id === val.id);
                            return (
                                <button
                                    key={val.id}
                                    onClick={() => toggleValue({
                                        ...val,
                                        source: 'user',
                                        explanation: 'Selected from library'
                                    })}
                                    disabled={isSelected}
                                    className={cn(
                                        "rounded-md border px-3 py-1.5 text-sm transition-all",
                                        isSelected
                                            ? "border-transparent bg-slate-100 text-slate-400 cursor-default"
                                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                                    )}
                                >
                                    {val.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        className="flex h-10 w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        placeholder="Add custom value..."
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                    />
                    <Button variant="secondary" onClick={handleAddCustom} disabled={!customValue.trim()}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrev}>Back</Button>
                <Button onClick={handleNext} disabled={selectedValues.length === 0}>Next: Principles</Button>
            </CardFooter>
        </Card>
    );
}
