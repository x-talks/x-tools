import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const CustomNode = memo(({ data, isConnectable }: NodeProps) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className="relative group min-w-[200px]"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

            <div className="bg-white dark:bg-slate-800 border-2 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                style={{ borderColor: data.color || '#e2e8f0' }}>
                {/* Header */}
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center"
                    style={{ backgroundColor: data.color || '#e2e8f0', color: data.textColor || '#000' }}>
                    <span>{data.entityType}</span>
                    {data.logo && (
                        <img src={data.logo} alt="logo" className="w-4 h-4 rounded-full bg-white object-contain" />
                    )}
                </div>

                {/* Body */}
                <div className="p-3 text-sm font-medium text-slate-900 dark:text-slate-100 break-words">
                    {data.label}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />

            {/* Tooltip */}
            {showTooltip && (
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
