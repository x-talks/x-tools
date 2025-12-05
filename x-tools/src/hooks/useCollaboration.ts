import { useEffect, useState, useCallback } from 'react';
import { useWizard } from '../core/store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface Presence {
    userId: string;
    userName: string;
    cursor?: { x: number; y: number };
    editingNodeId?: string;
    color: string;
}

interface BroadcastMessage {
    type: 'node_edit' | 'cursor_move' | 'edge_create' | 'edge_delete';
    payload: any;
    userId: string;
    userName: string;
}

export function useCollaboration(teamId: string | null) {
    const { dispatch } = useWizard();
    const [presences, setPresences] = useState<Record<string, Presence>>({});
    const [isConnected, setIsConnected] = useState(false);
    const [userId] = useState(() => crypto.randomUUID());
    const [userName] = useState(() => `User-${Math.floor(Math.random() * 1000)}`);
    const [userColor] = useState(() => {
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        return colors[Math.floor(Math.random() * colors.length)];
    });

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
                    self: false, // Don't receive own broadcasts
                },
            },
        });

        // Track presence (who's online)
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
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('User joined:', key, newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('User left:', key, leftPresences);
            })
            // Listen for broadcasts (real-time edits)
            .on('broadcast', { event: 'node_edit' }, ({ payload }: { payload: BroadcastMessage }) => {
                console.log('Received node edit:', payload);

                // Apply remote edit to local state
                if (payload.type === 'node_edit') {
                    dispatch({
                        type: 'UPDATE_NODE_METADATA',
                        payload: payload.payload
                    });
                }
            })
            .on('broadcast', { event: 'cursor_move' }, ({ payload }: { payload: BroadcastMessage }) => {
                // Update cursor position for remote user
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

                    // Track own presence
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
        };
    }, [teamId, userId, userName, userColor, dispatch]);

    // Broadcast node edit to other users
    const broadcastNodeEdit = useCallback(async (nodeData: any) => {
        if (!teamId) return;

        const supabase = createClient(supabaseUrl!, supabaseKey!);
        const channel = supabase.channel(`team:${teamId}`);

        await channel.send({
            type: 'broadcast',
            event: 'node_edit',
            payload: {
                type: 'node_edit',
                payload: nodeData,
                userId,
                userName
            }
        });
    }, [teamId, userId, userName]);

    // Broadcast cursor movement
    const broadcastCursor = useCallback(async (x: number, y: number) => {
        if (!teamId) return;

        const supabase = createClient(supabaseUrl!, supabaseKey!);
        const channel = supabase.channel(`team:${teamId}`);

        await channel.send({
            type: 'broadcast',
            event: 'cursor_move',
            payload: {
                type: 'cursor_move',
                payload: { x, y },
                userId,
                userName
            }
        });
    }, [teamId, userId, userName]);

    // Update editing status
    const setEditingNode = useCallback(async (nodeId: string | null) => {
        if (!teamId) return;

        const supabase = createClient(supabaseUrl!, supabaseKey!);
        const channel = supabase.channel(`team:${teamId}`);

        await channel.track({
            userId,
            userName,
            color: userColor,
            editingNodeId: nodeId,
            online_at: new Date().toISOString(),
        });
    }, [teamId, userId, userName, userColor]);

    return {
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
}
