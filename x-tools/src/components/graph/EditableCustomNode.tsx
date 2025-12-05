import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Edit2, Check, X, Tag } from 'lucide-react';

interface EditableNodeData {
    label: string;
    content?: string;
    description?: string;
    tags?: string[];
    entityType: string;
    color?: string;
    textColor?: string;
    logo?: string;
    isEditMode?: boolean;
}

export const EditableCustomNode = memo(({ data, isConnectable }: NodeProps<EditableNodeData>) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedLabel, setEditedLabel] = useState(data.label);
    const [editedDescription, setEditedDescription] = useState(data.description || '');
    const [editedTags, setEditedTags] = useState(data.tags || []);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showDescriptionEdit, setShowDescriptionEdit] = useState(false);
    const [showTagsEdit, setShowTagsEdit] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = useCallback(() => {
        if (data.isEditMode) {
            setIsEditing(true);
            setShowTooltip(false);
        }
    }, [data.isEditMode]);

    const handleSave = useCallback(() => {
        // Update the node data
        data.label = editedLabel;
        data.content = editedLabel;
        data.description = editedDescription;
        data.tags = editedTags;

        setIsEditing(false);
        setShowDescriptionEdit(false);
        setShowTagsEdit(false);
    }, [editedLabel, editedDescription, editedTags, data]);

    const handleCancel = useCallback(() => {
        setEditedLabel(data.label);
        setEditedDescription(data.description || '');
        setEditedTags(data.tags || []);
        setIsEditing(false);
        setShowDescriptionEdit(false);
        setShowTagsEdit(false);
    }, [data]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    }, [handleSave, handleCancel]);

    const addTag = useCallback((tag: string) => {
        if (tag.trim() && !editedTags.includes(tag.trim())) {
            setEditedTags([...editedTags, tag.trim()]);
        }
    }, [editedTags]);

    const removeTag = useCallback((tagToRemove: string) => {
        setEditedTags(editedTags.filter(t => t !== tagToRemove));
    }, [editedTags]);

    return (
        <div
            className="relative group min-w-[200px]"
            onMouseEnter={() => !isEditing && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onDoubleClick={handleDoubleClick}
        >
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

            <div
                className={`bg-white dark:bg-slate-800 border-2 rounded-lg shadow-md overflow-hidden transition-all ${isEditing ? 'ring-4 ring-blue-400 scale-105' : 'hover:scale-105'
                    } ${data.isEditMode ? 'cursor-pointer' : ''}`}
                style={{ borderColor: data.color || '#e2e8f0' }}
            >
                {/* Header */}
                <div
                    className="px-3 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center"
                    style={{ backgroundColor: data.color || '#e2e8f0', color: data.textColor || '#000' }}
                >
                    <span>{data.entityType}</span>
                    <div className="flex items-center gap-1">
                        {data.logo && (
                            <img src={data.logo} alt="logo" className="w-4 h-4 rounded-full bg-white object-contain" />
                        )}
                        {data.isEditMode && !isEditing && (
                            <Edit2 className="w-3 h-3 opacity-70" />
                        )}
                    </div>
                </div>

                {/* Body - Editable Label */}
                <div className="p-3">
                    {isEditing ? (
                        <div className="space-y-2">
                            {/* Label Input */}
                            <input
                                ref={inputRef}
                                type="text"
                                value={editedLabel}
                                onChange={(e) => setEditedLabel(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full px-2 py-1 text-sm font-medium border-2 border-blue-400 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                                placeholder="Node label..."
                            />

                            {/* Description Toggle */}
                            <button
                                onClick={() => setShowDescriptionEdit(!showDescriptionEdit)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                                <Edit2 className="w-3 h-3" />
                                {showDescriptionEdit ? 'Hide' : 'Edit'} Description
                            </button>

                            {showDescriptionEdit && (
                                <textarea
                                    ref={textareaRef}
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') handleCancel();
                                    }}
                                    rows={3}
                                    className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-400"
                                    placeholder="Add description..."
                                />
                            )}

                            {/* Tags Toggle */}
                            <button
                                onClick={() => setShowTagsEdit(!showTagsEdit)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                                <Tag className="w-3 h-3" />
                                {showTagsEdit ? 'Hide' : 'Edit'} Tags
                            </button>

                            {showTagsEdit && (
                                <div className="space-y-1">
                                    <div className="flex flex-wrap gap-1">
                                        {editedTags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-[10px]"
                                            >
                                                {tag}
                                                <button
                                                    onClick={() => removeTag(tag)}
                                                    className="hover:text-purple-900 dark:hover:text-purple-100"
                                                >
                                                    <X className="w-2.5 h-2.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTag(e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                                        placeholder="Add tag (press Enter)..."
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-1 pt-1">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
                                >
                                    <Check className="w-3 h-3" />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-2 py-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold flex items-center justify-center gap-1"
                                >
                                    <X className="w-3 h-3" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 break-words">
                            {data.label}
                            {data.isEditMode && (
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic">
                                    Double-click to edit
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />

            {/* Tooltip - Only show when not editing */}
            {showTooltip && !isEditing && (
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-4 bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none">
                    <div className="font-bold mb-1 text-base">{data.entityType}</div>
                    <div className="mb-2 text-sm leading-relaxed">{data.content || data.label}</div>
                    {data.description && (
                        <div className="text-slate-300 italic border-t border-slate-700 pt-2 mt-2">
                            {data.description}
                        </div>
                    )}
                    {data.tags && data.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {data.tags.map((tag: string, i: number) => (
                                <span key={i} className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">{tag}</span>
                            ))}
                        </div>
                    )}
                    {/* Arrow */}
                    <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
                </div>
            )}
        </div>
    );
});

EditableCustomNode.displayName = 'EditableCustomNode';
