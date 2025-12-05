import { Users } from 'lucide-react';

interface PresenceUser {
    userId: string;
    userName: string;
    color: string;
    editingNodeId?: string;
    cursor?: { x: number; y: number };
}

interface PresenceIndicatorProps {
    onlineUsers: PresenceUser[];
    isConnected: boolean;
}

export function PresenceIndicator({ onlineUsers, isConnected }: PresenceIndicatorProps) {
    if (!isConnected) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                <span>Connecting...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {onlineUsers.length === 0 ? 'Solo' : `${onlineUsers.length + 1} online`}
                </span>
            </div>

            {/* User Avatars */}
            {onlineUsers.length > 0 && (
                <div className="flex -space-x-2">
                    {onlineUsers.slice(0, 5).map((user) => (
                        <div
                            key={user.userId}
                            className="relative group"
                            title={user.userName}
                        >
                            <div
                                className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-[10px] font-bold"
                                style={{ backgroundColor: user.color }}
                            >
                                {user.userName.charAt(0).toUpperCase()}
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                {user.userName}
                                {user.editingNodeId && (
                                    <span className="text-slate-400"> • editing</span>
                                )}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                            </div>
                        </div>
                    ))}
                    {onlineUsers.length > 5 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-400 flex items-center justify-center text-white text-[10px] font-bold">
                            +{onlineUsers.length - 5}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
