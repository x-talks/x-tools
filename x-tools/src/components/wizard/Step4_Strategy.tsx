import { useState, useEffect, useMemo } from 'react';
import { useWizard } from '../../core/store';
import { STRATEGY_TEMPLATES, WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import AI, { SuggestionOption } from '../../core/ai';
import { AISuggestionModal } from '../AISuggestionModal';
import { MetadataEditor, Metadata } from '../MetadataEditor';

export function Step4_Strategy() {
    const { state, dispatch } = useWizard();
    const [strategyText, setStrategyText] = useState(state.strategy?.text || '');

    // Convert strategy templates to strings for library
    const staticLibrary = useMemo(() => STRATEGY_TEMPLATES.map(s => s.Strategy), []);
    const { items: libraryItems, addToLibrary } = useLibrary('strategy', staticLibrary);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<SuggestionOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [metadata, setMetadata] = useState<Metadata>({
        id: 'strategy-1',
        description: state.strategy?.description || '',
        tags: state.strategy?.tags || []
    });

    useEffect(() => {
        if (!strategyText && !state.strategy?.text) {
            const randomStrategy = libraryItems[Math.floor(Math.random() * libraryItems.length)];
            setStrategyText(randomStrategy);
        }
    }, []);

    // Real-time update with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentStrategy = state.strategy;
            const hasChanged =
                currentStrategy?.text !== strategyText ||
                currentStrategy?.description !== metadata.description ||
                JSON.stringify(currentStrategy?.tags) !== JSON.stringify(metadata.tags);

            if (hasChanged) {
                dispatch({
                    type: 'SET_STRATEGY',
                    payload: {
                        text: strategyText,
                        description: metadata.description,
                        tags: metadata.tags
                    }
                });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [strategyText, metadata, state.strategy, dispatch]);

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleMagicFill = () => {
        const randomStrategy = libraryItems[Math.floor(Math.random() * libraryItems.length)];
        setStrategyText(randomStrategy);
    };

    const handleAISuggest = async () => {
        setIsGeneratingAI(true);
        try {
            const response = await AI.suggestStrategy(
                strategyText || '',
                state.mission?.text,
                state.team?.teamName,
                undefined
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
        setStrategyText(text);
        setIsModalOpen(false);
    };

    const handleMetadataUpdate = (newMeta: Metadata) => {
        setMetadata(newMeta);
    };

    const handleGenerateMetadata = async () => {
        try {
            console.log('Generating metadata for:', strategyText);
            const generated = await AI.generateMetadata('Strategy', strategyText, `Mission: ${state.mission?.text || 'Unknown'}`);
            setMetadata((prev: Metadata) => ({
                ...prev,
                description: generated.description,
                tags: generated.tags
            }));
        } catch (error) {
            console.error('Failed to generate metadata:', error);
        }
    };

    return (
        <>
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
            >
                <MetadataEditor
                    id={metadata.id}
                    description={metadata.description}
                    tags={metadata.tags}
                    onUpdate={handleMetadataUpdate}
                    onGenerateWithAI={handleGenerateMetadata}
                    entityType="Strategy"
                />
            </WizardTextLayout>
            <AISuggestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                suggestions={aiSuggestions}
                onSelect={handleSelectSuggestion}
                title="Strategy Suggestions"
            />
        </>
    );
}
