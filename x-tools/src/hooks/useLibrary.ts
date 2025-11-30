import { useState, useEffect } from 'react';
import { LibraryManager, CustomLibrary } from '../core/libraryManager';

export function useLibrary<T>(type: keyof CustomLibrary, staticList: T[]) {
    const [items, setItems] = useState<T[]>(LibraryManager.getItems(type, staticList));

    useEffect(() => {
        const handleUpdate = () => {
            setItems(LibraryManager.getItems(type, staticList));
        };

        window.addEventListener('library-updated', handleUpdate);
        return () => window.removeEventListener('library-updated', handleUpdate);
    }, [type]); // staticList is usually constant

    const addToLibrary = (item: any) => {
        LibraryManager.addToLibrary(type, item);
    };

    return { items, addToLibrary };
}
