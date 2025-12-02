
import { useState, useEffect, useMemo } from 'react';
import { useWizard } from '../../core/store';
import { getVisionArchetypes, WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import AI, { SuggestionOption } from '../../core/ai';
import { AISuggestionModal } from '../AISuggestionModal';
import { MetadataEditor, Metadata } from '../MetadataEditor';

export function Step2_Vision() {
    const { state, dispatch } = useWizard();
    const [visionText, setVisionText] = useState(state.vision?.text || '');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<SuggestionOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [metadata, setMetadata] = useState<Metadata>({
        id: 'vision-1',
        description: state.vision?.description || '',
        tags: state.vision?.tags || []
    });

    const archetypes = getVisionArchetypes([]);
    const initialLibrary = useMemo(() => archetypes.map(a => a.description), []);
    const { items: libraryItems, addToLibrary } = useLibrary('vision', initialLibrary);

    // Pre-fill with example if empty
    useEffect(() => {
        if (!visionText && !state.vision?.text) {
            const randomArch = libraryItems[Math.floor(Math.random() * libraryItems.length)];
            setVisionText(randomArch);
        }
    }, []);

    // Real-time update with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentVision = state.vision;
            const hasChanged =
                currentVision?.text !== visionText ||
                currentVision?.description !== metadata.description ||
                JSON.stringify(currentVision?.tags) !== JSON.stringify(metadata.tags);

            if (hasChanged) {
                dispatch({
                    type: 'SET_VISION',
                    payload: {
                        id: 'vision-1',
                        text: visionText,
                        archetype: currentVision?.archetype || 'Custom Vision',
                        description: metadata.description,
                        tags: metadata.tags
                    }
                });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [visionText, metadata, state.vision, dispatch]);

    const handleNext = () => {
        dispatch({ type: 'GO_TO_STEP', payload: 3 });
    };

    const handleMagicFill = () => {
        const randomArch = libraryItems[Math.floor(Math.random() * libraryItems.length)];
        setVisionText(randomArch);
    };

    const handleAISuggest = async () => {
        setIsGeneratingAI(true);
        try {
            const response = await AI.suggestVision(
                visionText || '',
                state.team?.teamPurpose,
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
        setVisionText(text);
        setIsModalOpen(false);
    };

    const handleMetadataUpdate = (newMeta: Metadata) => {
        setMetadata(newMeta);
    };

    const handleGenerateMetadata = async () => {
        try {
            console.log('Generating metadata for:', visionText);
            const generated = await AI.generateMetadata('Vision', visionText, `Purpose: ${state.team?.teamPurpose || 'Unknown'}`);
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
                title="Step 2: Vision"
                description="What future do we want to create?"
                sideNoteContent={WIZARD_CONTENT.Vision}
                value={visionText}
                onChange={setVisionText}
                libraryItems={libraryItems}
                onAddToLibrary={addToLibrary}
                onAISuggest={handleAISuggest}
                onMagicFill={handleMagicFill}
                isGeneratingAI={isGeneratingAI}
                onNext={handleNext}
                onPrev={() => dispatch({ type: 'GO_TO_STEP', payload: 1 })}
                isNextDisabled={!visionText.trim()}
                example="A world where financial literacy is a universal human right."
            >
                <MetadataEditor
                    id={metadata.id}
                    description={metadata.description}
                    tags={metadata.tags}
                    onUpdate={handleMetadataUpdate}
                    onGenerateWithAI={handleGenerateMetadata}
                    entityType="Vision"
                />
            </WizardTextLayout>
            <AISuggestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                suggestions={aiSuggestions}
                onSelect={handleSelectSuggestion}
                title="Vision Suggestions"
            />
        </>
    );
}
