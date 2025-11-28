import { WizardState, SavedTeam } from '../types';

export interface StorageAdapter {
    saveTeam(state: WizardState): Promise<{ success: boolean; savedTeam?: SavedTeam; error?: string }>;
    loadTeam(id: string): Promise<WizardState | null>;
    listTeams(): Promise<SavedTeam[]>;
    deleteTeam(id: string): Promise<void>;
    initializeExampleTeam(): Promise<void>;
}
