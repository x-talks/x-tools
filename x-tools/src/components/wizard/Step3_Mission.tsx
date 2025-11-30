import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { MISSION_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import AI from '../../core/ai';

export function Step3_Mission() {
    const { state, dispatch } = useWizard();
    const [mission, setMission] = useState(state.mission?.text || '');
    const { items: libraryItems, addToLibrary } = useLibrary('mission', MISSION_TEMPLATES);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

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
            const suggestion = await AI.suggestMission(
                state.vision?.text || '',
                mission
            );
            setMission(suggestion);
        } catch (error) {
            console.error('AI suggestion failed:', error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    return (
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
    );
}
