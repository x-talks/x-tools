import { useState } from 'react';
import { useWizard } from '../../core/store';
import { WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import AI, { SuggestionOption } from '../../core/ai';
import { AISuggestionModal } from '../AISuggestionModal';

export function Step1_Purpose() {
    const { state, dispatch } = useWizard();
    const [purpose, setPurpose] = useState(state.team?.teamPurpose || '');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<SuggestionOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { items: libraryItems, addToLibrary } = useLibrary('purpose', WIZARD_CONTENT.Purpose.Examples);

    const handleNext = () => {
        if (state.team) {
            dispatch({
                type: 'SET_TEAM',
                payload: { ...state.team, teamPurpose: purpose }
            });
        }
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const randomExample = libraryItems[Math.floor(Math.random() * libraryItems.length)];
        setPurpose(randomExample);
    };

    const handleAISuggest = async () => {
        setIsGeneratingAI(true);
        try {
            const response = await AI.suggestPurpose(purpose || '', state.team?.teamName, undefined);
            if (response.suggestions && response.suggestions.length > 0) {
                setAiSuggestions(response.suggestions);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleSelectSuggestion = (text: string) => {
        setPurpose(text);
        setIsModalOpen(false);
    };

    return (
        <>
            <WizardTextLayout
                title="Step 1: Purpose"
                description="Why does our team exist?"
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
                example="To enable our customers to make better financial decisions through accessible data."
            />
            <AISuggestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                suggestions={aiSuggestions}
                onSelect={handleSelectSuggestion}
                title="Purpose Suggestions"
            />
        </>
    );
}
