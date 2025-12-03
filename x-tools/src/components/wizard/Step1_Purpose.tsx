import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import { useSyncedState } from '../../hooks/useSyncedState';
import AI, { SuggestionOption } from '../../core/ai';
import { AISuggestionModal } from '../AISuggestionModal';
import { MetadataEditor, Metadata } from '../MetadataEditor';

export function Step1_Purpose() {
    const { state, dispatch } = useWizard();
    const [purpose, setPurpose] = useSyncedState(state.team?.teamPurpose, '');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<SuggestionOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [metadata, setMetadata] = useSyncedState(
        state.team?.purposeMetadata,
        { id: 'purpose-1', description: '', tags: [] }
    );

    const { items: libraryItems, addToLibrary } = useLibrary('purpose', [...WIZARD_CONTENT.Purpose.Examples, ...(WIZARD_CONTENT.Purpose.Statements || [])]);

    // Real-time update with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (state.team) {
                // Only dispatch if changed to avoid loops
                const hasChanged =
                    state.team.teamPurpose !== purpose ||
                    state.team.purposeMetadata?.description !== metadata.description ||
                    JSON.stringify(state.team.purposeMetadata?.tags) !== JSON.stringify(metadata.tags);

                if (hasChanged) {
                    dispatch({
                        type: 'SET_TEAM',
                        payload: {
                            ...state.team,
                            teamPurpose: purpose,
                            purposeMetadata: {
                                description: metadata.description,
                                tags: metadata.tags
                            }
                        }
                    });
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [purpose, metadata, state.team, dispatch]);

    const handleNext = () => {
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

    const handleMetadataUpdate = (newMeta: Metadata) => {
        setMetadata(newMeta);
    };

    const handleGenerateMetadata = async () => {
        try {
            console.log('Generating metadata for:', purpose);
            const generated = await AI.generateMetadata('Purpose', purpose, `Team: ${state.team?.teamName || 'Unknown'}`);
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
            >
                <MetadataEditor
                    id={metadata.id}
                    description={metadata.description}
                    tags={metadata.tags}
                    onUpdate={handleMetadataUpdate}
                    onGenerateWithAI={handleGenerateMetadata}
                    entityType="Purpose"
                />
            </WizardTextLayout>
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
