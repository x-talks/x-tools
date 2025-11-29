import { extractSemanticTags } from '../core/ontology';

interface SemanticTagsProps {
    text: string;
    maxTags?: number;
}

const CONCEPT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    SPEED: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
    QUALITY: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
    INNOVATION: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-300 dark:border-pink-700' },
    STABILITY: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
    AUTONOMY: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
    CONTROL: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700' },
    COLLABORATION: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-700' },
    INDIVIDUAL: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700' },
    CUSTOMER: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-300 dark:border-teal-700' },
    BUSINESS: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-300 dark:border-indigo-700' },
    TRANSPARENCY: { bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-300 dark:border-lime-700' },
    PRIVACY: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-700' },
};

export function SemanticTags({ text, maxTags = 3 }: SemanticTagsProps) {
    const tags = extractSemanticTags(text);
    const displayTags = tags.slice(0, maxTags);

    if (displayTags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1.5 mt-2">
            {displayTags.map((tag, index) => {
                const colors = CONCEPT_COLORS[tag.concept] || CONCEPT_COLORS.QUALITY;
                const confidencePercent = Math.round(tag.confidence * 100);

                return (
                    <span
                        key={index}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
                        title={`${tag.keywords.join(', ')} (${confidencePercent}% confidence)`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {tag.concept.toLowerCase()}
                    </span>
                );
            })}
        </div>
    );
}
