import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { SideNote } from '../ui/SideNote';
import { Button } from '../ui/Button';
import { ChevronDown, ChevronUp, Sparkles, Wand2, Save } from 'lucide-react';


interface WizardTextLayoutProps {
    title: string;
    description: string;
    sideNoteContent: any;

    value: string;
    onChange: (value: string) => void;

    libraryItems: (string | { label: string, description?: string })[];

    onAddToLibrary: (text: string) => void;
    onAISuggest: () => void;
    onMagicFill: () => void;

    isGeneratingAI: boolean;

    onNext: () => void;
    onPrev: () => void;
    nextLabel?: string;
    isNextDisabled?: boolean;

    example?: string;
    children?: React.ReactNode;
}

export function WizardTextLayout({
    title,
    description,
    sideNoteContent,
    value,
    onChange,
    libraryItems,
    onAddToLibrary,
    onAISuggest,
    onMagicFill,
    isGeneratingAI,
    onNext,
    onPrev,
    nextLabel = "Next",
    isNextDisabled,
    example,
    children
}: WizardTextLayoutProps) {
    const [isLibraryExpanded, setIsLibraryExpanded] = useState(false);

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-slate-500">{description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <SideNote content={sideNoteContent} />

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Statement</label>
                        <div className="flex gap-2">
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
                    </div>

                    <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder={`Describe your ${title.toLowerCase().replace('step ', '').split(':')[1] || 'statement'}...`}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />

                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAddToLibrary(value)}
                            disabled={!value.trim()}
                            className="text-slate-500 hover:text-blue-600"
                            title="Add current text to library"
                        >
                            <Save className="h-4 w-4 mr-2" /> Add to Library
                        </Button>
                    </div>

                    {example && (
                        <p className="text-xs text-slate-400 italic mt-1">
                            Example: "{example}"
                        </p>
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
                            <div className="flex flex-col gap-2">
                                {libraryItems.map((item, i) => {
                                    const label = typeof item === 'string' ? item : item.label;
                                    const desc = typeof item === 'string' ? '' : item.description;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => onChange(desc || label)}
                                            className="text-left p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 transition-all"
                                        >
                                            <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{label}</div>
                                            {desc && <div className="text-xs text-slate-500">{desc}</div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {children}

            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={onPrev}>Back</Button>
                <Button onClick={onNext} disabled={isNextDisabled}>{nextLabel}</Button>
            </CardFooter>
        </Card>
    );
}
