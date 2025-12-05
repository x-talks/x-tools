import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useWizard } from './store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface Presence {
    userId: string;
    userName: string;
    cursor?: { x: number; y: number };
    editingNodeId?: string;
    color: string;
}

interface CollaborationContextType {
    presences: Record<string, Presence>;
    isConnected: boolean;
    userId: string;
    userName: string;
    userColor: string;
    broadcastNodeEdit: (nodeData: any) => void;
    broadcastCursor: (x: number, y: number) => void;
    setEditingNode: (nodeId: string | null) => void;
    onlineUsers: Presence[];
}

const CollaborationContext = createContext<CollaborationContextType | null>(null);

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
    const { state, dispatch } = useWizard();
    const teamId = state.team?.teamId || null;

    const [presences, setPresences] = useState<Record<string, Presence>>({});
    const [isConnected, setIsConnected] = useState(false);
    const [userId] = useState(() => {
        const stored = localStorage.getItem('x_user_id');
        if (stored) return stored;
        const newId = crypto.randomUUID();
        localStorage.setItem('x_user_id', newId);
        return newId;
    });

    const [userName] = useState(() => {
        const stored = localStorage.getItem('x_user_name');
        if (stored) return stored;
        const newName = `User-${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem('x_user_name', newName);
        return newName;
    });

    const [userColor] = useState(() => {
        const stored = localStorage.getItem('x_user_color');
        if (stored) return stored;
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        localStorage.setItem('x_user_color', newColor);
        return newColor;
    });

    const channelRef = useRef<any>(null);

    useEffect(() => {
        if (!supabaseUrl || !supabaseKey || !teamId) {
            return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const channel = supabase.channel(`team:${teamId}`, {
            config: {
                presence: {
                    key: userId,
                },
                broadcast: {
                    self: false,
                    ack: false,
                },
            },
        });

        channelRef.current = channel;

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const presenceMap: Record<string, Presence> = {};

                Object.keys(state).forEach((key) => {
                    const presenceArray = state[key] as any[];
                    if (presenceArray && presenceArray.length > 0) {
                        const presence = presenceArray[0];
                        if (presence && typeof presence === 'object' && 'userId' in presence) {
                            presenceMap[key] = presence as Presence;
                        }
                    }
                });

                setPresences(presenceMap);
            })
            // Listen for broadcasts (real-time edits)
            .on('broadcast', { event: 'node_edit' }, ({ payload }: { payload: any }) => {
                // Apply remote edit to local state
                if (payload.type === 'node_edit') {
                    dispatch({
                        type: 'UPDATE_NODE_METADATA',
                        payload: payload.payload
                    });
                }
            })
            .on('broadcast', { event: 'cursor_move' }, ({ payload }: { payload: any }) => {
                setPresences(prev => ({
                    ...prev,
                    [payload.userId]: {
                        ...prev[payload.userId],
                        cursor: payload.payload
                    }
                }));
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true);
                    await channel.track({
                        userId,
                        userName,
                        color: userColor,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
            setIsConnected(false);
            channelRef.current = null;
        };
    }, [teamId, userId, userName, userColor, dispatch]);

    const broadcastNodeEdit = useCallback(async (nodeData: any) => {
        if (!teamId || !channelRef.current) return;
        channelRef.current.send({
            type: 'broadcast',
            event: 'node_edit',
            payload: { type: 'node_edit', payload: nodeData, userId, userName }
        });
    }, [teamId, userId, userName]);

    const throttleRef = useRef(0);
    const broadcastCursor = useCallback((x: number, y: number) => {
        const now = Date.now();
        if (now - throttleRef.current < 50) return;
        throttleRef.current = now;

        if (!teamId || !channelRef.current) return;
        channelRef.current.send({
            type: 'broadcast',
            event: 'cursor_move',
            payload: { type: 'cursor_move', payload: { x, y }, userId, userName }
        });
    }, [teamId, userId, userName]);

    const setEditingNode = useCallback(async (nodeId: string | null) => {
        if (!teamId || !channelRef.current) return;
        await channelRef.current.track({
            userId,
            userName,
            color: userColor,
            editingNodeId: nodeId,
            online_at: new Date().toISOString(),
        });
    }, [teamId, userId, userName, userColor]);

    const value = {
        presences,
        isConnected,
        userId,
        userName,
        userColor,
        broadcastNodeEdit,
        broadcastCursor,
        setEditingNode,
        onlineUsers: Object.values(presences).filter(p => p.userId !== userId)
    };

    return (
        <CollaborationContext.Provider value={value}>
            {children}
        </CollaborationContext.Provider>
    );
}

export function useCollaborationContext() {
    const context = useContext(CollaborationContext);
    if (!context) {
        // Return dummy context if not wrapped (for safety)
        return {
            presences: {},
            isConnected: false,
            userId: '',
            userName: '',
            userColor: '',
            broadcastNodeEdit: () => { },
            broadcastCursor: () => { },
            setEditingNode: () => { },
            onlineUsers: []
        };
    }
    return context;
}
