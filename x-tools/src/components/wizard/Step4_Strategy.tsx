import { useState, useEffect, useMemo } from 'react';
import { useWizard } from '../../core/store';
import { STRATEGY_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import AI from '../../core/ai';

export function Step4_Strategy() {
    const { state, dispatch } = useWizard();
    const [strategyText, setStrategyText] = useState(state.strategy?.text || '');

    // Convert strategy templates to strings for library
    const staticLibrary = useMemo(() => STRATEGY_TEMPLATES.map(s => s.Strategy), []);
    const { items: libraryItems, addToLibrary } = useLibrary('strategy', staticLibrary);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    useEffect(() => {
        if (!strategyText && !state.strategy?.text) {
            const randomStrategy = libraryItems[Math.floor(Math.random() * libraryItems.length)];
            setStrategyText(randomStrategy);
        }
    }, []);

    const handleNext = () => {
        dispatch({
            type: 'SET_STRATEGY',
            payload: {
                text: strategyText
            }
        });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const randomStrategy = libraryItems[Math.floor(Math.random() * libraryItems.length)];
        setStrategyText(randomStrategy);
    };

    const handleAISuggest = async () => {
        setIsGeneratingAI(true);
        try {
            const suggestion = await AI.suggestStrategy(
                state.mission?.text,
                state.values.map(v => v.label)
            );
            setStrategyText(suggestion);
        } catch (error) {
            console.error('AI suggestion failed:', error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    return (
        <WizardTextLayout
            title="Step 4: Strategy"
            description="How we win."
            sideNoteContent={WIZARD_CONTENT.Strategy}
            value={strategyText}
            onChange={setStrategyText}
            libraryItems={libraryItems}
            onAddToLibrary={addToLibrary}
            onAISuggest={handleAISuggest}
            onMagicFill={handleMagicFill}
            isGeneratingAI={isGeneratingAI}
            onNext={handleNext}
            onPrev={() => dispatch({ type: 'PREV_STEP' })}
            isNextDisabled={!strategyText.trim()}
            example="Compete through AI-powered automation and modular architecture."
        />
    );
}
