import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Sparkles, Target, Flag, Heart, Scale, Users, Trophy } from 'lucide-react';

// Custom node component for team identity elements
export const TeamNode = memo(({ data }: NodeProps) => {
    const getNodeStyle = () => {
        const baseStyle = "px-4 py-3 rounded-lg border-2 shadow-lg min-w-[180px] transition-all hover:shadow-xl hover:scale-105";

        switch (data.nodeType) {
            case 'purpose':
                return `${baseStyle} bg-gradient-to-br from-rose-50 to-rose-100 border-rose-400 text-rose-900`;
            case 'vision':
                return `${baseStyle} bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400 text-orange-900`;
            case 'mission':
                return `${baseStyle} bg-gradient-to-br from-amber-50 to-amber-100 border-amber-400 text-amber-900`;
            case 'value':
                return `${baseStyle} bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-400 text-cyan-900`;
            case 'principle':
                return `${baseStyle} bg-gradient-to-br from-purple-50 to-purple-100 border-purple-400 text-purple-900`;
            case 'behavior':
                return `${baseStyle} bg-gradient-to-br from-green-50 to-green-100 border-green-400 text-green-900`;
            case 'goal':
                return `${baseStyle} bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-500 text-emerald-900`;
            case 'role':
                return `${baseStyle} bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 text-pink-900`;
            case 'person':
                return `${baseStyle} bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 text-slate-900`;
            default:
                return `${baseStyle} bg-white border-slate-300`;
        }
    };

    const getIcon = () => {
        const iconClass = "h-5 w-5";
        switch (data.nodeType) {
            case 'purpose':
                return <Heart className={iconClass} />;
            case 'vision':
                return <Sparkles className={iconClass} />;
            case 'mission':
                return <Target className={iconClass} />;
            case 'value':
                return <Heart className={iconClass} />;
            case 'principle':
                return <Scale className={iconClass} />;
            case 'behavior':
                return <Users className={iconClass} />;
            case 'goal':
                return <Trophy className={iconClass} />;
            case 'role':
                return <Flag className={iconClass} />;
            case 'person':
                return <Users className={iconClass} />;
            default:
                return null;
        }
    };

    return (
        <div className={getNodeStyle()}>
            <Handle type="target" position={Position.Top} className="!bg-slate-400" />

            <div className="flex items-center gap-2">
                {getIcon()}
                <div>
                    <div className="font-semibold text-sm">{data.nodeType?.toUpperCase()}</div>
                    <div className="text-sm font-medium truncate max-w-[160px]" title={data.label}>
                        {data.label}
                    </div>
                </div>
            </div>

            {data.text && (
                <div className="mt-2 text-xs opacity-75 line-clamp-2" title={data.text}>
                    {data.text}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
        </div>
    );
});

TeamNode.displayName = 'TeamNode';
