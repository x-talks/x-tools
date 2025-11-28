import { beforeEach } from 'vitest';
import { setAdapter } from '../core/storage';
import { LocalStorageAdapter } from '../core/storage/LocalStorageAdapter';

// Force tests to use LocalStorage instead of Supabase
beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Force use of LocalStorage adapter for tests
    setAdapter(new LocalStorageAdapter());
});
