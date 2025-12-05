import { useEffect } from 'react';
import { useCollaborationContext } from '../core/collaboration';
import { MousePointer2 } from 'lucide-react';

export function MultiplayerLayer() {
    const { presences, broadcastCursor, isConnected } = useCollaborationContext();

    // Track local mouse movement
    useEffect(() => {
        if (!isConnected) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Normalize coordinates to percentage to handle different screen sizes
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            broadcastCursor(x, y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [broadcastCursor, isConnected]);

    if (!isConnected) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Object.values(presences).map((user) => {
                if (!user.cursor) return null;

                // Convert percentage back to pixels
                const left = (user.cursor.x / 100) * window.innerWidth;
                const top = (user.cursor.y / 100) * window.innerHeight;

                return (
                    <div
                        key={user.userId}
                        className="absolute transition-all duration-100 ease-linear"
                        style={{
                            transform: `translate(${left}px, ${top}px)`
                        }}
                    >
                        <MousePointer2
                            className="w-4 h-4"
                            style={{
                                color: user.color,
                                fill: user.color
                            }}
                        />
                        <div
                            className="ml-4 px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap"
                            style={{ backgroundColor: user.color }}
                        >
                            {user.userName}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
