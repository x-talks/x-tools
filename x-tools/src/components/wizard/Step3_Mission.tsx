import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { WIZARD_CONTENT } from '../../core/rules';
import { WizardTextLayout } from './WizardTextLayout';
import { useLibrary } from '../../hooks/useLibrary';
import AI, { SuggestionOption } from '../../core/ai';
import { AISuggestionModal } from '../AISuggestionModal';
import { MetadataEditor, Metadata } from '../MetadataEditor';

export function Step3_Mission() {
    const { state, dispatch } = useWizard();
    const [mission, setMission] = useState(state.mission?.text || '');
    const { items: libraryItems, addToLibrary } = useLibrary('mission', WIZARD_CONTENT.Mission.Examples);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<SuggestionOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [metadata, setMetadata] = useState<Metadata>({
        id: 'mission-1',
        description: state.mission?.description || '',
        tags: state.mission?.tags || []
    });

    useEffect(() => {
        if (!mission && !state.mission?.text) {
            const randomMission = libraryItems[Math.floor(Math.random() * libraryItems.length)];
            setMission(randomMission);
        }
    }, []);

    // Real-time update with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentMission = state.mission;
            const hasChanged =
                currentMission?.text !== mission ||
                currentMission?.description !== metadata.description ||
                JSON.stringify(currentMission?.tags) !== JSON.stringify(metadata.tags);

            if (hasChanged) {
                dispatch({
                    type: 'SET_MISSION',
                    payload: {
                        id: 'mission-1',
                        text: mission,
                        keywords: currentMission?.keywords || [],
                        description: metadata.description,
                        tags: metadata.tags
                    }
                });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [mission, metadata, state.mission, dispatch]);

    const handleNext = () => {
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
                mission || '',
                state.vision?.text,
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
        setMission(text);
        setIsModalOpen(false);
    };

    const handleMetadataUpdate = (newMeta: Metadata) => {
        setMetadata(newMeta);
    };

    const handleGenerateMetadata = async () => {
        try {
            console.log('Generating metadata for:', mission);
            const generated = await AI.generateMetadata('Mission', mission, `Vision: ${state.vision?.text || 'Unknown'}`);
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
            >
                <MetadataEditor
                    id={metadata.id}
                    description={metadata.description}
                    tags={metadata.tags}
                    onUpdate={handleMetadataUpdate}
                    onGenerateWithAI={handleGenerateMetadata}
                    entityType="Mission"
                />
            </WizardTextLayout>
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
