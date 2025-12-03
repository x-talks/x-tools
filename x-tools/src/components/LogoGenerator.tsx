import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { RefreshCw, Dice5 } from 'lucide-react';
import { LogoService } from '../core/LogoService';
import { cn } from '../utils/cn';

interface LogoGeneratorProps {
    teamName: string;
    onSelect: (logoDataUrl: string) => void;
    className?: string;
    context?: {
        purpose?: string;
        vision?: string;
        mission?: string;
        values?: string[];
        principles?: string[];
    };
}

export function LogoGenerator({ teamName, onSelect, className, context }: LogoGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('identicon');
    const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
    const [salt, setSalt] = useState('');

    const styles = LogoService.listStyles();

    const handleGenerate = () => {
        if (!teamName) return;
        setIsGenerating(true);

        // Small delay to allow UI to update
        setTimeout(() => {
            try {
                const svg = LogoService.generate({
                    teamName,
                    ...context,
                    salt
                }, selectedStyle);
                setGeneratedSvg(svg);

                // Auto-select/pass up
                const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
                onSelect(dataUrl);
            } catch (e) {
                console.error("Logo generation failed", e);
            } finally {
                setIsGenerating(false);
            }
        }, 100);
    };

    const handleRegenerate = () => {
        setSalt(crypto.randomUUID());
    };

    // Regenerate when dependencies change
    useEffect(() => {
        if (teamName) {
            handleGenerate();
        }
    }, [teamName, selectedStyle, salt, context]);

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Deterministic Logo Generator</label>
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedStyle}
                            onChange={(e) => setSelectedStyle(e.target.value)}
                            className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {styles.map(style => (
                                <option key={style} value={style}>{style}</option>
                            ))}
                        </select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRegenerate}
                            disabled={isGenerating || !teamName}
                            title="Regenerate with new salt"
                        >
                            <Dice5 className="h-4 w-4 text-slate-500" />
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center p-6 bg-slate-50 border border-slate-200 rounded-lg min-h-[200px] items-center">
                    {isGenerating ? (
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                            <span className="text-sm">Generating...</span>
                        </div>
                    ) : generatedSvg ? (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <div
                                className="w-48 h-48 bg-white rounded-xl shadow-sm p-4 border border-slate-100"
                                dangerouslySetInnerHTML={{ __html: generatedSvg }}
                            />
                            <div className="text-xs text-slate-400 font-mono">
                                Style: {selectedStyle}
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-400 text-sm">
                            Enter a team name to generate a logo
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
