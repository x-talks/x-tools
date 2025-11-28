// React import removed – not needed with the new JSX runtime
import { cn } from '../../utils/cn';

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
    const examples = content.Examples || [];
    const bestPractice = content.BestPractice || content.BestPractices;

    return (
        <div className={cn("bg-blue-50 border-l-4 border-blue-500 p-4 space-y-3", className)}>
            <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide">{title}</h4>

            {/* What & Why */}
            {(what || why) && (
                <div className="text-sm text-blue-900 space-y-1">
                    {what && <p><strong>What:</strong> {what}</p>}
                    {why && <p><strong>Why:</strong> {why}</p>}
                </div>
            )}

            {/* Formula */}
            {formulas.length > 0 && (
                <div className="bg-blue-100/50 p-2 rounded text-sm text-blue-800 font-mono">
                    <strong>Formula:</strong>
                    <ul className="list-disc list-inside mt-1">
                        {formulas.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </div>
            )}

            {/* Best Practice */}
            {bestPractice && (
                <div className="text-sm text-blue-800">
                    <strong>Best Practice:</strong> {bestPractice}
                </div>
            )}

            {/* Examples */}
            {examples.length > 0 && (
                <div className="text-sm text-blue-700 italic">
                    <strong>Examples:</strong>
                    <ul className="list-disc list-inside mt-1">
                        {examples.map((ex, i) => {
                            if (typeof ex === 'string') {
                                return <li key={i}>"{ex}"</li>;
                            } else {
                                return (
                                    <li key={i} className="mb-2 not-italic">
                                        <span className="font-semibold">"{ex.Objective}"</span>
                                        <ul className="list-[circle] list-inside ml-4 mt-1 text-xs text-blue-600">
                                            {ex.KeyResults.map((kr, j) => <li key={j}>{kr}</li>)}
                                        </ul>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
