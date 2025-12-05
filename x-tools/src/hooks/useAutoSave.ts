import { useEffect, useState, useCallback, useRef } from 'react';
import { useWizard } from '../core/store';
import { saveTeam } from '../core/storage';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutoSave(debounceMs: number = 3000) {
    const { state } = useWizard();
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const saveTimeoutRef = useRef<number | undefined>(undefined);
    const lastStateRef = useRef<string>('');

    const performSave = useCallback(async () => {
        // Only save if we have a team
        if (!state.team?.teamName) {
            return;
        }

        setSaveStatus('saving');
        setError(null);

        try {
            const result = await saveTeam(state);

            if (result.success) {
                setSaveStatus('saved');
                setLastSaved(new Date());

                // Reset to idle after 2 seconds
                setTimeout(() => {
                    setSaveStatus('idle');
                }, 2000);
            } else {
                setSaveStatus('error');
                setError(result.error || 'Failed to save');

                // Reset to idle after 5 seconds
                setTimeout(() => {
                    setSaveStatus('idle');
                    setError(null);
                }, 5000);
            }
        } catch (err) {
            setSaveStatus('error');
            setError(err instanceof Error ? err.message : 'Unknown error');

            // Reset to idle after 5 seconds
            setTimeout(() => {
                setSaveStatus('idle');
                setError(null);
            }, 5000);
        }
    }, [state]);

    // Auto-save when state changes
    useEffect(() => {
        // Serialize state to detect changes
        const currentState = JSON.stringify(state);

        // Skip if state hasn't changed
        if (currentState === lastStateRef.current) {
            return;
        }

        lastStateRef.current = currentState;

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout for debounced save
        saveTimeoutRef.current = setTimeout(() => {
            performSave();
        }, debounceMs) as unknown as number;

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [state, debounceMs, performSave]);

    // Manual save function
    const manualSave = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        performSave();
    }, [performSave]);

    return {
        saveStatus,
        lastSaved,
        error,
        manualSave,
        isSaving: saveStatus === 'saving',
        isSaved: saveStatus === 'saved',
        hasError: saveStatus === 'error'
    };
}
