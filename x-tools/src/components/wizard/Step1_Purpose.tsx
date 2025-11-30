import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { PURPOSE_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import AI from '../../core/ai';

export function Step1_Purpose() {
    const { state, dispatch } = useWizard();
    const [purpose, setPurpose] = useState(state.team?.teamPurpose || '');
    const { items: libraryItems, addToLibrary } = useLibrary('purpose', PURPOSE_TEMPLATES);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

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

    const handleAISuggest = async () => {
        setIsGeneratingAI(true);
        try {
            const suggestion = await AI.suggestPurpose(state.team?.teamName, undefined, purpose);
            setPurpose(suggestion);
        } catch (error) {
            console.error('AI suggestion failed:', error);
        } finally {
            setIsGeneratingAI(false);
        }
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
            onAISuggest={handleAISuggest}
            onMagicFill={handleMagicFill}
            isGeneratingAI={isGeneratingAI}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'PREV_STEP' })}
            isNextDisabled={!purpose.trim()}
            example="To organize the world's information."
        />
    );
}
