import { WizardState, SavedTeam } from '../types';
import { StorageAdapter } from './types';
import { validateTeamCompleteness } from './validation';

const STORAGE_KEY = 'teamDataArray';
const INIT_FLAG_KEY = 'teamup-initialized';

export class LocalStorageAdapter implements StorageAdapter {
    async listTeams(): Promise<SavedTeam[]> {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            return JSON.parse(raw);
        } catch (e) {
            console.error('Failed to load teams from storage', e);
            return [];
        }
    }

    async saveTeam(state: WizardState): Promise<{ success: boolean; savedTeam?: SavedTeam; error?: string }> {
        // Validate completeness
        const validation = validateTeamCompleteness(state);
        if (!validation.isComplete) {
            return {
                success: false,
                error: `Team is incomplete. Missing: ${validation.missing.join(', ')}`
            };
        }

        const teams = await this.listTeams();
        const teamId = state.team?.teamId || crypto.randomUUID();

        const savedTeam: SavedTeam = {
            id: teamId,
            name: state.team?.teamName || 'Untitled Team',
            updatedAt: new Date().toISOString(),
            state: state
        };

        const existingIndex = teams.findIndex(t => t.id === teamId);
        if (existingIndex >= 0) {
            teams[existingIndex] = savedTeam;
        } else {
            teams.push(savedTeam);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
        return { success: true, savedTeam };
    }

    async loadTeam(id: string): Promise<WizardState | null> {
        const teams = await this.listTeams();
        const team = teams.find(t => t.id === id);
        return team ? team.state : null;
    }

    async deleteTeam(id: string): Promise<void> {
        const teams = await this.listTeams();
        const filtered = teams.filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    // Track if initialization is in progress to prevent race conditions
    private isInitializing = false;

    async initializeExampleTeam(): Promise<void> {
        // Prevent multiple simultaneous initializations
        if (this.isInitializing) {
            return;
        }

        // Check if we've already initialized (persisted flag)
        const alreadyInitialized = localStorage.getItem(INIT_FLAG_KEY);
        if (alreadyInitialized) {
            return;
        }

        this.isInitializing = true;

        try {
            const existing = await this.listTeams();

            // Don't initialize if:
            // 1. Teams already exist, OR
            // 2. The example team is already in the list
            const exampleExists = existing.some(team => team.id === 'example-team-001');

            if (existing.length === 0 && !exampleExists) {
                // Import dynamically to avoid circular dependencies
                // Note: We need to adjust the import path since we moved the file
                const { EXAMPLE_TEAM } = await import('../exampleTeam');

                const exampleSaved: SavedTeam = {
                    id: EXAMPLE_TEAM.team!.teamId,
                    name: EXAMPLE_TEAM.team!.teamName,
                    updatedAt: new Date().toISOString(),
                    state: EXAMPLE_TEAM
                };

                localStorage.setItem(STORAGE_KEY, JSON.stringify([exampleSaved]));
            }

            // Mark as initialized
            localStorage.setItem(INIT_FLAG_KEY, 'true');
        } finally {
            this.isInitializing = false;
        }
    }
}
