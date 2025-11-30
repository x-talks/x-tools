import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { SideNote } from '../ui/SideNote';
import { Button } from '../ui/Button';
import { ChevronDown, ChevronUp, Plus, Sparkles, Wand2, Save } from 'lucide-react';
import { cn } from '../../utils/cn';
import { DraggableList } from '../DraggableList';

interface WizardStepLayoutProps<T> {
    title: string;
    description: string;
    sideNoteContent: any;

    // Data
    selectedItems: T[];
    libraryItems: T[];

    // Actions
    onAdd: (text: string) => void;
    onReorder: (items: T[]) => void;
    onAddToLibrary: (text: string) => void;
    onAISuggest: () => void;
    onMagicFill: () => void;

    // Render props
    renderItem: (item: T) => React.ReactNode;
    getLabel: (item: T) => string;
    getId: (item: T) => string;

    // State
    isGeneratingAI: boolean;

    // Navigation
    onNext: () => void;
    onPrev: () => void;
    nextLabel?: string;
    isNextDisabled?: boolean;

    // Example
    example?: string;
}

export function WizardStepLayout<T>({
    title,
    description,
    sideNoteContent,
    selectedItems,
    libraryItems,
    onAdd,
    onReorder,
    onAddToLibrary,
    onAISuggest,
    onMagicFill,
    renderItem,
    getLabel,
    getId,
    isGeneratingAI,
    onNext,
    onPrev,
    nextLabel = "Next",
    isNextDisabled,
    example
}: WizardStepLayoutProps<T>) {
    const [inputText, setInputText] = useState('');
    const [isLibraryExpanded, setIsLibraryExpanded] = useState(false);

    const handleAdd = () => {
        if (inputText.trim()) {
            onAdd(inputText);
            setInputText('');
        }
    };

    const handleAddToLibrary = () => {
        if (inputText.trim()) {
            onAddToLibrary(inputText);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-slate-500">{description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <SideNote content={sideNoteContent} />

                {/* Input Area */}
                <div className="space-y-3">
                    {/* Action Buttons Row (Above Input) */}
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onAISuggest}
                            disabled={isGeneratingAI}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:border-purple-900 dark:hover:bg-purple-900/20"
                        >
                            <Sparkles className={`h-4 w-4 mr-2 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                            {isGeneratingAI ? 'Thinking...' : 'AI Suggest'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onMagicFill} title="Magic Fill">
                            <Wand2 className="h-4 w-4 text-slate-400" />
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            className="flex-1 h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            placeholder={`Add new item...`}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <Button variant="secondary" onClick={handleAdd} disabled={!inputText.trim()}>
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>

                    {/* Example - directly below input */}
                    {example && (
                        <p className="text-xs text-slate-400 italic -mt-1">
                            Example: "{example}"
                        </p>
                    )}

                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleAddToLibrary}
                            disabled={!inputText.trim()}
                            className="text-slate-500 hover:text-blue-600"
                            title="Add current text to library"
                        >
                            <Save className="h-4 w-4 mr-2" /> Add to Library
                        </Button>
                    </div>
                </div>

                {/* Selected Items (Drag & Drop) */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Your Selection (Drag to reorder)</h4>
                    {selectedItems.length === 0 ? (
                        <div className="text-sm text-slate-400 italic p-4 border border-dashed border-slate-200 rounded-lg text-center">
                            No items selected yet. Use the input above or choose from the library.
                        </div>
                    ) : (
                        <DraggableList
                            items={selectedItems.map(item => ({
                                id: getId(item),
                                content: renderItem(item)
                            }))}
                            onReorder={(reordered) => {
                                const newOrder = reordered.map(r => selectedItems.find(i => getId(i) === r.id)!);
                                onReorder(newOrder);
                            }}
                        />
                    )}
                </div>

                {/* Expandable Library */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <span className="text-sm font-medium">Library ({libraryItems.length})</span>
                        {isLibraryExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isLibraryExpanded && (
                        <div className="p-3 bg-white dark:bg-slate-900 max-h-60 overflow-y-auto">
                            <div className="flex flex-wrap gap-2">
                                {libraryItems.map((item) => {
                                    const label = getLabel(item);
                                    const isSelected = selectedItems.some(i => getLabel(i) === label);
                                    return (
                                        <button
                                            key={getId(item)}
                                            onClick={() => onAdd(label)}
                                            disabled={isSelected}
                                            className={cn(
                                                "rounded-md border px-3 py-1.5 text-sm transition-all text-left",
                                                isSelected
                                                    ? "border-transparent bg-slate-100 text-slate-400 cursor-default"
                                                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-500"
                                            )}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={onPrev}>Back</Button>
                <Button onClick={onNext} disabled={isNextDisabled}>{nextLabel}</Button>
            </CardFooter>
        </Card>
    );
}
