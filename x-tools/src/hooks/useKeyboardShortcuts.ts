import { useEffect } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

export function useKeyboardShortcuts(handlers: Record<string, KeyHandler>) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modKey = isMac ? event.metaKey : event.ctrlKey;

            // Ctrl/Cmd + S → Save
            if (modKey && event.key === 's') {
                event.preventDefault();
                handlers['save']?.(event);
            }
            // Ctrl/Cmd + → → Next
            else if (modKey && event.key === 'ArrowRight') {
                event.preventDefault();
                handlers['next']?.(event);
            }
            // Ctrl/Cmd + ← → Previous
            else if (modKey && event.key === 'ArrowLeft') {
                event.preventDefault();
                handlers['prev']?.(event);
            }
            // / → Search focus
            else if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
                const activeElement = document.activeElement;
                if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
                    event.preventDefault();
                    handlers['search']?.(event);
                }
            }
            // Ctrl/Cmd + Z → Undo
            else if (modKey && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                handlers['undo']?.(event);
            }
            // Ctrl/Cmd + Shift + Z → Redo
            else if (modKey && event.key === 'z' && event.shiftKey) {
                event.preventDefault();
                handlers['redo']?.(event);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
}
