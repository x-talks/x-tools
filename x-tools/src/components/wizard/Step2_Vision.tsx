
import { useState, useEffect, useMemo } from 'react';
import { useWizard } from '../../core/store';
import { getVisionArchetypes, WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import AI from '../../core/ai';

export function Step2_Vision() {
    const { state, dispatch } = useWizard();
    const [visionText, setVisionText] = useState(state.vision?.text || '');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    const archetypes = getVisionArchetypes([]);
    const initialLibrary = useMemo(() => archetypes.map(a => ({ label: a.label, description: a.description })), []);
    const { items: libraryItems, addToLibrary } = useLibrary('vision', initialLibrary);

    // Pre-fill with example if empty
    useEffect(() => {
        if (!visionText && !state.vision?.text) {
            const randomArch = libraryItems[Math.floor(Math.random() * libraryItems.length)];
            setVisionText(randomArch.description);
        }
    }, []);

    const handleNext = () => {
        dispatch({
            type: 'SET_VISION',
            payload: {
                text: visionText,
                archetype: 'Custom Vision'
            }
        });
        dispatch({ type: 'GO_TO_STEP', payload: 3 });
    };

    const handleMagicFill = () => {
        const randomArch = libraryItems[Math.floor(Math.random() * libraryItems.length)];
        setVisionText(randomArch.description);
    };

    const handleAISuggest = async () => {
        setIsGeneratingAI(true);
        try {
            const suggestion = await AI.suggestVision(
                state.team?.teamPurpose,
                state.values.map(v => v.label)
            );
            setVisionText(suggestion);
        } catch (error) {
            console.error('AI suggestion failed:', error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    return (
        <WizardTextLayout
            title="Step 2: Vision"
            description="What future do we want to create?"
            sideNoteContent={WIZARD_CONTENT.Vision}
            value={visionText}
            onChange={setVisionText}
            libraryItems={libraryItems}
            onAddToLibrary={(text) => addToLibrary({ label: 'Custom Vision', description: text })}
            onAISuggest={handleAISuggest}
            onMagicFill={handleMagicFill}
            isGeneratingAI={isGeneratingAI}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'GO_TO_STEP', payload: 1 })}
            isNextDisabled={!visionText.trim()}
            example="A world where financial literacy is a universal human right."
        />
    );
}
