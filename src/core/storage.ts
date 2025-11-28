import { LocalStorageAdapter } from './storage/LocalStorageAdapter';
import { SupabaseAdapter } from './storage/SupabaseAdapter';
import { StorageAdapter } from './storage/types';
import { WizardState, SavedTeam } from './types';
import { validateTeamCompleteness } from './storage/validation';

export { validateTeamCompleteness };

// Initialize adapter based on environment variables
function createAdapter(): StorageAdapter {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
        console.log('Using Supabase storage adapter');
        return new SupabaseAdapter(supabaseUrl, supabaseKey);
    } else {
        console.log('Using LocalStorage adapter (Supabase credentials not found)');
        return new LocalStorageAdapter();
    }
}

// Singleton instance
let adapter: StorageAdapter = createAdapter();

export function setAdapter(newAdapter: StorageAdapter) {
    adapter = newAdapter;
}

export const getSavedTeams = async (): Promise<SavedTeam[]> => {
    return adapter.listTeams();
};

export const saveTeam = async (state: WizardState): Promise<{ success: boolean; savedTeam?: SavedTeam; error?: string }> => {
    return adapter.saveTeam(state);
};

export const loadTeam = async (id: string): Promise<WizardState | null> => {
    return adapter.loadTeam(id);
};

export const deleteTeam = async (id: string): Promise<void> => {
    return adapter.deleteTeam(id);
};

export const initializeExampleTeam = async (): Promise<void> => {
    return adapter.initializeExampleTeam();
};

