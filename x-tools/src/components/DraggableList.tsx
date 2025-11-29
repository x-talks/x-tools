import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItem {
    id: string;
    content: React.ReactNode;
}

interface DraggableListProps {
    items: SortableItem[];
    onReorder: (items: SortableItem[]) => void;
    className?: string;
}

function SortableItem({ id, content }: { id: string; content: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center gap-2 ${isDragging ? 'z-50' : ''}`}
        >
            <button
                {...attributes}
                {...listeners}
                className="flex-shrink-0 p-1 rounded cursor-grab active:cursor-grabbing hover:bg-slate-200 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Drag to reorder"
            >
                <GripVertical className="h-4 w-4 text-slate-400" />
            </button>
            <div className="flex-1">
                {content}
            </div>
        </div>
    );
}

export function DraggableList({ items, onReorder, className = '' }: DraggableListProps) {
    const [localItems, setLocalItems] = useState(items);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localItems.findIndex((item) => item.id === active.id);
            const newIndex = localItems.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(localItems, oldIndex, newIndex);
            setLocalItems(newItems);
            onReorder(newItems);
        }
    };

    // Update local items when prop changes
    if (JSON.stringify(items.map(i => i.id)) !== JSON.stringify(localItems.map(i => i.id))) {
        setLocalItems(items);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={localItems.map(item => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className={`space-y-2 ${className}`}>
                    {localItems.map((item) => (
                        <SortableItem key={item.id} id={item.id} content={item.content} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
