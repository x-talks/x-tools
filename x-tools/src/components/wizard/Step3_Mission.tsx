import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { MISSION_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';

export function Step3_Mission() {
    const { state, dispatch } = useWizard();
    const [mission, setMission] = useState(state.mission?.text || '');
    const { items: libraryItems, addToLibrary } = useLibrary('mission', MISSION_TEMPLATES);

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

    return (
        <WizardTextLayout
            title="Step 3: Mission"
            description="What we do every day."
            sideNoteContent={WIZARD_CONTENT.Mission}
            value={mission}
            onChange={setMission}
            libraryItems={libraryItems}
            onAddToLibrary={addToLibrary}
            onAISuggest={() => console.log('AI Suggest')}
            onMagicFill={handleMagicFill}
            isGeneratingAI={false}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'PREV_STEP' })}
            isNextDisabled={!mission.trim()}
            example="To accelerate the world's transition to sustainable energy."
        />
    );
}
