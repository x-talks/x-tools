import { describe, it, expect, beforeEach } from 'vitest';
import { saveTeam, loadTeam } from '../core/storage';
import type { WizardState } from '../core/types';
import { RelationType } from '../core/types';

describe('Saved Teams Metadata Restoration', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should restore rich metadata for all entities', async () => {
        const richState: WizardState = {
            team: {
                teamId: 'meta-test-team',
                teamName: 'Metadata Test Team',
                teamPurpose: 'Testing metadata persistence',
                purposeMetadata: {
                    description: 'Detailed purpose description',
                    tags: ['tag1', 'tag2']
                },
                goals: [
                    {
                        id: 'g1',
                        text: 'Rich Goal',
                        description: 'Goal description',
                        tags: ['priority-high'],
                        strategyId: 's1',
                        type: 'objective',
                        progress: 50
                    }
                ],
                createdAt: new Date().toISOString(),
                createdBy: 'tester'
            },
            mission: {
                text: 'Rich Mission',
                keywords: ['rich'],
                metadata: {
                    description: 'Mission description',
                    tags: ['mission-tag']
                }
            },
            vision: {
                text: 'Rich Vision',
                archetype: 'Visionary',
                metadata: {
                    description: 'Vision description',
                    tags: ['vision-tag']
                }
            },
            strategy: {
                text: 'Rich Strategy',
                metadata: {
                    description: 'Strategy description',
                    tags: ['strategy-tag']
                }
            },
            goals: [
                {
                    id: 'g1',
                    text: 'Rich Goal',
                    description: 'Goal description',
                    tags: ['priority-high'],
                    strategyId: 's1',
                    type: 'objective',
                    progress: 50
                }
            ],
            values: [
                {
                    id: 'v1',
                    label: 'Rich Value',
                    source: 'user',
                    explanation: 'Value explanation',
                    metadata: {
                        description: 'Value description',
                        tags: ['value-tag']
                    }
                }
            ],
            behaviors: [
                {
                    id: 'b1',
                    label: 'Rich Behavior',
                    derivedFromValues: ['v1'],
                    explanation: 'Behavior explanation',
                    ruleId: 'rule1',
                    metadata: {
                        description: 'Behavior description',
                        tags: ['behavior-tag']
                    }
                }
            ],
            principles: [
                {
                    id: 'p1',
                    label: 'Rich Principle',
                    explanation: 'Principle explanation',
                    metadata: {
                        description: 'Principle description',
                        tags: ['principle-tag']
                    },
                    valueId: 'v1'
                }
            ],
            roles: [],
            people: [],
            auditLog: [],
            currentStep: 9,
            relationships: [
                {
                    id: 'manual-rel-1',
                    sourceId: 'v1',
                    targetId: 'g1',
                    sourceType: 'value',
                    targetType: 'goal',
                    relationType: RelationType.SUPPORTS,
                    strength: 100,
                    confidence: 100,
                    auto_detected: false,
                    explanation: 'Manual link'
                }
            ],
            graphLayout: {
                positions: {
                    'v1': { x: 100, y: 200 }
                }
            },
            insights: [],
            sentimentScore: 0
        };

        // 1. Save the rich state
        const saveResult = await saveTeam(richState);
        expect(saveResult.success).toBe(true);

        // 2. Load the team back
        const loadedState = await loadTeam(richState.team!.teamId);
        expect(loadedState).not.toBeNull();

        if (loadedState) {
            // 4. Verify all metadata fields
            expect(loadedState.team!.teamName).toBe('Metadata Test Team');
            expect(loadedState.team!.purposeMetadata).toEqual({
                description: 'Detailed purpose description',
                tags: ['tag1', 'tag2']
            });

            // Note: I updated types to put desc/tags in `metadata`, so checking that
            expect(loadedState.mission!.metadata?.description).toBe('Mission description');
            expect(loadedState.mission!.metadata?.tags).toEqual(['mission-tag']);

            expect(loadedState.vision!.metadata?.description).toBe('Vision description');
            expect(loadedState.vision!.metadata?.tags).toEqual(['vision-tag']);

            expect(loadedState.strategy!.metadata?.description).toBe('Strategy description');
            expect(loadedState.strategy!.metadata?.tags).toEqual(['strategy-tag']);

            // Goal description/tags were kept on top level in types.ts for some reason?
            // Let's check types.ts again. 
            // In types.ts I added metadata AND kept desc/tags optional.
            // For goals, I updated test data to use top-level description as well.
            expect(loadedState.goals[0].description).toBe('Goal description');
            expect(loadedState.goals[0].tags).toEqual(['priority-high']);
            expect(loadedState.goals[0].strategyId).toBe('s1');

            expect(loadedState.values[0].metadata?.description).toBe('Value description');
            expect(loadedState.values[0].metadata?.tags).toEqual(['value-tag']);

            expect(loadedState.principles[0].metadata?.description).toBe('Principle description');
            expect(loadedState.principles[0].metadata?.tags).toEqual(['principle-tag']);
            expect(loadedState.principles[0].valueId).toBe('v1');

            expect(loadedState.behaviors[0].metadata?.description).toBe('Behavior description');
            expect(loadedState.behaviors[0].metadata?.tags).toEqual(['behavior-tag']);

            // 5. Verify graph persistence
            expect(loadedState.relationships).toHaveLength(1);
            expect(loadedState.relationships![0].id).toBe('manual-rel-1');

            expect(loadedState.graphLayout).toBeDefined();
            expect(loadedState.graphLayout.positions['v1']).toEqual({ x: 100, y: 200 });
        }
    });
});
