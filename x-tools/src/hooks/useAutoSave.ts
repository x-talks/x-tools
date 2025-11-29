import { useEffect, useState, useRef } from 'react';
import { WizardState } from '../core/types';
import { saveTeam } from '../core/storage';

export function useAutoSave(state: WizardState, enabled: boolean = true) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const timeoutRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!enabled || !state.team?.teamName) return;

        // Clear existing timeout
        if (timeoutRef.current !== undefined) {
            clearTimeout(timeoutRef.current);
        }

        // Auto-save after 3 seconds of inactivity
        timeoutRef.current = setTimeout(async () => {
            setIsSaving(true);
            try {
                await saveTeam(state);
                setLastSaved(new Date());
            } catch (error) {
                console.error('Auto-save failed:', error);
            } finally {
                setIsSaving(false);
            }
        }, 3000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [state, enabled]);

    return { isSaving, lastSaved };
}
