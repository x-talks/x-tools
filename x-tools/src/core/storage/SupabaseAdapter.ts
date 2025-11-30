import { WizardState, SavedTeam } from '../types';
import { StorageAdapter } from './types';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseAdapter implements StorageAdapter {
    private supabase: SupabaseClient;

    constructor(url: string, key: string) {
        this.supabase = createClient(url, key);
    }

    async listTeams(): Promise<SavedTeam[]> {
        try {
            const { data, error } = await this.supabase
                .from('teams')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) {
                console.error('Supabase listTeams error:', error);
                return [];
            }

            return (data || []).map(row => ({
                id: row.id,
                name: row.name,
                updatedAt: row.updated_at,
                state: row.state
            }));
        } catch (e) {
            console.error('Failed to list teams from Supabase', e);
            return [];
        }
    }

    async saveTeam(state: WizardState): Promise<{ success: boolean; savedTeam?: SavedTeam; error?: string }> {
        // Relaxed validation for saving: only require name
        if (!state.team?.teamName) {
            return {
                success: false,
                error: 'Team name is required to save.'
            };
        }

        const teamId = state.team?.teamId || crypto.randomUUID();
        const savedTeam: SavedTeam = {
            id: teamId,
            name: state.team?.teamName || 'Untitled Team',
            updatedAt: new Date().toISOString(),
            state: state
        };

        try {
            const { error } = await this.supabase
                .from('teams')
                .upsert({
                    id: savedTeam.id,
                    name: savedTeam.name,
                    updated_at: savedTeam.updatedAt,
                    state: savedTeam.state
                });

            if (error) {
                console.error('Supabase saveTeam error:', error);
                return { success: false, error: error.message };
            }

            return { success: true, savedTeam };
        } catch (e: any) {
            console.error('Failed to save team to Supabase', e);
            return { success: false, error: e.message || 'Unknown error' };
        }
    }

    async loadTeam(id: string): Promise<WizardState | null> {
        try {
            const { data, error } = await this.supabase
                .from('teams')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Supabase loadTeam error:', error);
                return null;
            }

            return data?.state || null;
        } catch (e) {
            console.error('Failed to load team from Supabase', e);
            return null;
        }
    }

    async deleteTeam(id: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from('teams')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Supabase deleteTeam error:', error);
            }
        } catch (e) {
            console.error('Failed to delete team from Supabase', e);
        }
    }

    async initializeExampleTeam(): Promise<void> {
        try {
            const teams = await this.listTeams();
            const { EXAMPLE_TEAM, EXAMPLE_TEAM_2 } = await import('../exampleTeam');
            const examples = [EXAMPLE_TEAM, EXAMPLE_TEAM_2];

            for (const example of examples) {
                if (!example.team?.teamId) continue;

                const exists = teams.some(team => team.id === example.team!.teamId);

                if (!exists) {
                    const exampleSaved: SavedTeam = {
                        id: example.team!.teamId,
                        name: example.team!.teamName,
                        updatedAt: new Date().toISOString(),
                        state: example
                    };

                    const { error } = await this.supabase
                        .from('teams')
                        .insert({
                            id: exampleSaved.id,
                            name: exampleSaved.name,
                            updated_at: exampleSaved.updatedAt,
                            state: exampleSaved.state
                        });

                    if (error) {
                        console.error(`Failed to insert example team ${exampleSaved.name}:`, error);
                    }
                }
            }
        } catch (e) {
            console.error('Failed to initialize example teams in Supabase', e);
        }
    }
}
