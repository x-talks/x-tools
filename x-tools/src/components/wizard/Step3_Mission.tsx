import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import AI, { SuggestionOption } from '../../core/ai';
import { AISuggestionModal } from '../AISuggestionModal';

export function Step3_Mission() {
    const { state, dispatch } = useWizard();
    const [mission, setMission] = useState(state.mission?.text || '');
    const { items: libraryItems, addToLibrary } = useLibrary('mission', WIZARD_CONTENT.Mission.Examples);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<SuggestionOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!mission && !state.mission?.text) {
            const randomMission = libraryItems[Math.floor(Math.random() * libraryItems.length)];
            setMission(randomMission);
        }
    }, []);

    const handleNext = () => {
        dispatch({
            type: 'SET_MISSION',
            payload: {
                text: mission,
                keywords: []
            }
        });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const randomMission = libraryItems[Math.floor(Math.random() * libraryItems.length)];
        setMission(randomMission);
    };

    const handleAISuggest = async () => {
        setIsGeneratingAI(true);
        try {
            const response = await AI.suggestMission(
                state.vision?.text || '',
                mission
            );
            if (response.suggestions && response.suggestions.length > 0) {
                setAiSuggestions(response.suggestions);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error('AI suggestion failed:', error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleSelectSuggestion = (text: string) => {
        setMission(text);
        setIsModalOpen(false);
    };

    return (
        <>
            <WizardTextLayout
                title="Step 3: Mission"
                description="What we do every day."
                sideNoteContent={WIZARD_CONTENT.Mission}
                value={mission}
                onChange={setMission}
                libraryItems={libraryItems}
                onAddToLibrary={addToLibrary}
                onAISuggest={handleAISuggest}
                onMagicFill={handleMagicFill}
                isGeneratingAI={isGeneratingAI}
                onNext={handleNext}
                onPrev={() => dispatch({ type: 'PREV_STEP' })}
                isNextDisabled={!mission.trim()}
                example="To accelerate the world's transition to sustainable energy."
            />
            <AISuggestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                suggestions={aiSuggestions}
                onSelect={handleSelectSuggestion}
                title="Mission Suggestions"
            />
        </>
    );
}
