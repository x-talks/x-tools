import { useMemo } from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    const html = useMemo(() => {
        if (!content) return '';

        let processed = content;

        // Headers
        processed = processed.replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold mt-2 mb-1">$1</h3>');
        processed = processed.replace(/^## (.+)$/gm, '<h2 class="text-base font-bold mt-3 mb-1">$1</h2>');
        processed = processed.replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-3 mb-2">$1</h1>');

        // Bold
        processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
        processed = processed.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');

        // Italic
        processed = processed.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
        processed = processed.replace(/_(.+?)_/g, '<em class="italic">$1</em>');

        // Code inline
        processed = processed.replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs font-mono">$1</code>');

        // Links
        processed = processed.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

        // Unordered lists
        processed = processed.replace(/^\* (.+)$/gm, '<li class="ml-4">• $1</li>');
        processed = processed.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');

        // Ordered lists
        let olCounter = 0;
        processed = processed.replace(/^\d+\. (.+)$/gm, () => {
            olCounter++;
            return `<li class="ml-4">${olCounter}. $1</li>`;
        });

        // Wrap consecutive list items
        processed = processed.replace(/(<li class="ml-4">.*<\/li>\n?)+/g, (match) => {
            return `<ul class="space-y-0.5 my-1">${match}</ul>`;
        });

        // Line breaks
        processed = processed.replace(/\n\n/g, '<br/><br/>');
        processed = processed.replace(/\n/g, '<br/>');

        return processed;
    }, [content]);

    return (
        <div
            className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
