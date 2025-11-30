import { useState } from 'react';
import { cn } from '../../utils/cn';
import { ChevronUp, Network } from 'lucide-react';
import { OntologyView } from '../OntologyView';

interface SideNoteContent {
    Formula?: string | string[];
    Description?: { What: string; Why: string };
    What?: string;
    Why?: string;
    Examples?: (string | { Objective: string; KeyResults: string[] })[];
    BestPractice?: string;
    BestPractices?: string;
}

interface SideNoteProps {
    content: SideNoteContent;
    className?: string;
    title?: string;
}

export function SideNote({ content, className, title = "Explanation" }: SideNoteProps) {
    const formulas = Array.isArray(content.Formula) ? content.Formula : (content.Formula ? [content.Formula] : []);
    const what = content.Description?.What || content.What;
    const why = content.Description?.Why || content.Why;
    const bestPractice = content.BestPractice || content.BestPractices;

    const [isExpanded, setIsExpanded] = useState(() => {
        return localStorage.getItem('sideNoteExpanded') === 'true';
    });

    const toggleExpand = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem('sideNoteExpanded', String(newState));
    };

    return (
        <div className={cn("bg-blue-50 border-l-4 border-blue-500 p-4 space-y-3", className)}>
            <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide">{title}</h4>

            {/* Always Visible: What & Why */}
            {(what || why) && (
                <div className="text-sm text-blue-900 space-y-1">
                    {what && <p><strong>What:</strong> {what}</p>}
                    {why && <p><strong>Why:</strong> {why}</p>}
                </div>
            )}

            {/* Always Visible: Formula */}
            {formulas.length > 0 && (
                <div className="bg-blue-100/50 p-2 rounded text-sm text-blue-800 font-mono">
                    <strong>Formula:</strong>
                    <ul className="list-disc list-inside mt-1">
                        {formulas.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </div>
            )}

            {/* Always Visible: Best Practice */}
            {bestPractice && (
                <div className="text-sm text-blue-800">
                    <strong>Best Practice:</strong> {bestPractice}
                </div>
            )}

            {/* Toggle Button - Always visible at the same position */}
            <button
                onClick={toggleExpand}
                className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 mt-2 focus:outline-none w-full justify-center py-1 bg-blue-100/30 rounded hover:bg-blue-100/50 transition-colors"
            >
                {isExpanded ? (
                    <>Hide Ontology <ChevronUp className="ml-1 h-3 w-3" /></>
                ) : (
                    <>Ontology View <Network className="ml-1 h-3 w-3" /></>
                )}
            </button>

            {/* Expandable Content: Ontology View */}
            {isExpanded && (
                <div className="space-y-3 pt-2 border-t border-blue-200/50 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <OntologyView />
                </div>
            )}
        </div>
    );
}
