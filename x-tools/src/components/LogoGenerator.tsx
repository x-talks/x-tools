import { useState } from 'react';
import { Button } from './ui/Button';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import { generateLogoVariations, GeneratedLogo, svgToDataURL } from '../core/logoGenerator';
import { cn } from '../utils/cn';

interface LogoGeneratorProps {
    teamName: string;
    onSelect: (logoDataUrl: string) => void;
    className?: string;
}

export function LogoGenerator({ teamName, onSelect, className }: LogoGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [variations, setVariations] = useState<GeneratedLogo[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!teamName) return;

        setIsGenerating(true);
        setSelectedIndex(null);
        try {
            // Generate variations (AI + Rule-based)
            const results = await generateLogoVariations(teamName);
            setVariations(results);
        } catch (error) {
            console.error('Failed to generate logos:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        const logo = variations[index];
        const dataUrl = svgToDataURL(logo.svg);
        onSelect(dataUrl);
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">AI Logo Generator</label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isGenerating || !teamName}
                    className="gap-2"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-3 w-3 text-purple-500" />
                            Generate Logos
                        </>
                    )}
                </Button>
            </div>

            {variations.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {variations.map((logo, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative group cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-blue-400 hover:shadow-md",
                                selectedIndex === index
                                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                                    : "border-slate-200 bg-white"
                            )}
                            onClick={() => handleSelect(index)}
                        >
                            <div
                                className="w-full aspect-square rounded-md overflow-hidden bg-white"
                                dangerouslySetInnerHTML={{ __html: logo.svg }}
                            />

                            {selectedIndex === index && (
                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 shadow-sm">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}

                            <div className="mt-2 text-xs text-slate-500 text-center truncate px-1">
                                {logo.style.type}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
