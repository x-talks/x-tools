import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { PURPOSE_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';

export function Step1_Purpose() {
    const { state, dispatch } = useWizard();
    const [purpose, setPurpose] = useState(state.team?.teamPurpose || '');
    const { items: libraryItems, addToLibrary } = useLibrary('purpose', PURPOSE_TEMPLATES);

    useEffect(() => {
        if (!purpose && !state.team?.teamPurpose) {
            const randomPurpose = libraryItems[Math.floor(Math.random() * libraryItems.length)];
            setPurpose(randomPurpose);
        }
    }, []);

    const handleNext = () => {
        dispatch({
            type: 'SET_TEAM',
            payload: {
                ...state.team!,
                teamPurpose: purpose
            }
        });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const randomPurpose = libraryItems[Math.floor(Math.random() * libraryItems.length)];
        setPurpose(randomPurpose);
    };

    return (
        <WizardTextLayout
            title="Step 1: Purpose"
            description="Why we exist."
            sideNoteContent={WIZARD_CONTENT.Purpose}
            value={purpose}
            onChange={setPurpose}
            libraryItems={libraryItems}
            onAddToLibrary={addToLibrary}
            onAISuggest={() => console.log('AI Suggest')}
            onMagicFill={handleMagicFill}
            isGeneratingAI={false}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'PREV_STEP' })}
            isNextDisabled={!purpose.trim()}
            example="To organize the world's information."
        />
    );
}
