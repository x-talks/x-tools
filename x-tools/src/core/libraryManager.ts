

const STORAGE_KEY = 'antigravity_custom_library';

export interface CustomLibrary {
    values: any[];
    principles: string[];
    behaviors: string[];
    goals: string[];
    purpose: string[];
    mission: string[];
    vision: { label: string, description: string }[];
    strategy: string[];
}

export const LibraryManager = {
    getCustomLibrary(): CustomLibrary {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : { values: [], principles: [], behaviors: [], goals: [], purpose: [], mission: [], vision: [], strategy: [] };
        } catch {
            return { values: [], principles: [], behaviors: [], goals: [], purpose: [], mission: [], vision: [], strategy: [] };
        }
    },

    addToLibrary(type: keyof CustomLibrary, item: any) {
        const lib = this.getCustomLibrary();
        if (!lib[type]) lib[type] = [];

        // Avoid duplicates
        const exists = lib[type].some((i: any) =>
            typeof i === 'string' ? i === item : JSON.stringify(i) === JSON.stringify(item)
        );

        if (!exists) {
            lib[type].push(item);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lib));
            window.dispatchEvent(new Event('library-updated'));
        }
    },

    getItems(type: keyof CustomLibrary, staticList: any[]) {
        const custom = this.getCustomLibrary()[type] || [];
        return [...staticList, ...custom];
    }
};
