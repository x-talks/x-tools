import { useEffect, useState, Dispatch, SetStateAction } from 'react';

/**
 * Custom hook to sync local state with global wizard state
 * Prevents data loss when navigating back and forth in the wizard
 * 
 * @param globalValue - The value from global wizard state
 * @param initialValue - Initial value if global value is undefined
 * @returns [localValue, setLocalValue] - Tuple similar to useState
 */
export function useSyncedState<T>(
    globalValue: T | undefined,
    initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
    const [localValue, setLocalValue] = useState<T>(globalValue ?? initialValue);

    // Sync local state when global state changes (e.g., navigating back)
    useEffect(() => {
        const newValue = globalValue ?? initialValue;
        // Only update if different to avoid infinite loops
        if (JSON.stringify(newValue) !== JSON.stringify(localValue)) {
            setLocalValue(newValue);
        }
    }, [globalValue]);

    return [localValue, setLocalValue];
}
