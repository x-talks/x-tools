import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
    save?: () => void;
    search?: () => void;
    undo?: () => void;
    redo?: () => void;
    next?: () => void;
    prev?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if we're in an input field
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            // Undo: Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && !isInput) {
                if (handlers.undo) {
                    e.preventDefault();
                    handlers.undo();
                }
            }

            // Redo: Ctrl+Shift+Z or Ctrl+Y (Windows/Linux) or Cmd+Shift+Z (Mac)
            if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
                ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
                if (handlers.redo && !isInput) {
                    e.preventDefault();
                    handlers.redo();
                }
            }

            // Save: Ctrl+S or Cmd+S
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                if (handlers.save) {
                    e.preventDefault();
                    handlers.save();
                }
            }

            // Search: Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                if (handlers.search) {
                    e.preventDefault();
                    handlers.search();
                }
            }

            // Next: Ctrl+Right or Cmd+Right
            if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight' && !isInput) {
                if (handlers.next) {
                    e.preventDefault();
                    handlers.next();
                }
            }

            // Prev: Ctrl+Left or Cmd+Left
            if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft' && !isInput) {
                if (handlers.prev) {
                    e.preventDefault();
                    handlers.prev();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
}
