import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, X, Sparkles } from 'lucide-react';

export interface Metadata {
    id?: string;
    description?: string;
    tags?: string[];
}

export interface MetadataProps extends Metadata {
    onUpdate: (metadata: Metadata) => void;
    onGenerateWithAI?: () => Promise<void>;
    isGenerating?: boolean;
    entityType?: string;
}

export function MetadataEditor({ id, description, tags = [], onUpdate, onGenerateWithAI, isGenerating, entityType }: MetadataProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [editingDesc, setEditingDesc] = useState(description || '');
    const [editingTags, setEditingTags] = useState(tags);
    const [newTag, setNewTag] = useState('');

    // Sync local state with props when they change (e.g. after AI generation)
    useEffect(() => {
        setEditingDesc(description || '');
        setEditingTags(tags || []);
    }, [description, tags]);

    const handleSave = () => {
        onUpdate({
            id,
            description: editingDesc,
            tags: editingTags
        });
    };

    const handleAddTag = () => {
        if (newTag.trim() && !editingTags.includes(newTag.trim())) {
            const updated = [...editingTags, newTag.trim()];
            setEditingTags(updated);
            setNewTag('');
            onUpdate({ id, description: editingDesc, tags: updated });
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const updated = editingTags.filter(t => t !== tagToRemove);
        setEditingTags(updated);
        onUpdate({ id, description: editingDesc, tags: updated });
    };

    return (
        <div className="mt-3 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {entityType || 'Metadata'} {description || tags.length > 0 ? '(AI-Generated)' : ''}
                    </span>
                </div>
                {onGenerateWithAI && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onGenerateWithAI();
                        }}
                        disabled={isGenerating}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                        <Sparkles className="h-3 w-3" />
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                )}
            </button>

            {isExpanded && (
                <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
                    {/* ID (Read-only) */}
                    {id && (
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                ID (auto-generated)
                            </label>
                            <input
                                type="text"
                                value={id}
                                readOnly
                                className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500"
                            />
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={editingDesc}
                            onChange={(e) => setEditingDesc(e.target.value)}
                            onBlur={handleSave}
                            placeholder="AI-generated description will appear here..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {editingTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                                >
                                    {tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-purple-900 dark:hover:text-purple-100"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Add a tag..."
                                className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            />
                            <button
                                onClick={handleAddTag}
                                className="px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-1"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
