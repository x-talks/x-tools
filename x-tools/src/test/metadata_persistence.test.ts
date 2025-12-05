import { describe, it, expect, beforeEach } from 'vitest';
import { saveTeam, getSavedTeams, loadTeam } from '../core/storage';
import type { WizardState, SemanticRelationship } from '../core/types';
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
                        strategyId: 's1'
                    }
                ],
                createdAt: new Date().toISOString(),
                createdBy: 'tester'
            },
            mission: {
                text: 'Rich Mission',
                keywords: ['rich'],
                description: 'Mission description',
                tags: ['mission-tag']
            },
            vision: {
                text: 'Rich Vision',
                archetype: 'Visionary',
                description: 'Vision description',
                tags: ['vision-tag']
            },
            strategy: {
                text: 'Rich Strategy',
                description: 'Strategy description',
                tags: ['strategy-tag']
            },
            goals: [
                {
                    id: 'g1',
                    text: 'Rich Goal',
                    description: 'Goal description',
                    tags: ['priority-high'],
                    strategyId: 's1'
                }
            ],
            values: [
                {
                    id: 'v1',
                    label: 'Rich Value',
                    source: 'user',
                    explanation: 'Value explanation',
                    description: 'Value description',
                    tags: ['value-tag']
                }
            ],
            behaviors: [
                {
                    id: 'b1',
                    label: 'Rich Behavior',
                    derivedFromValues: ['v1'],
                    explanation: 'Behavior explanation',
                    ruleId: 'rule1',
                    description: 'Behavior description',
                    tags: ['behavior-tag']
                }
            ],
            principles: [
                {
                    id: 'p1',
                    label: 'Rich Principle',
                    explanation: 'Principle explanation',
                    description: 'Principle description',
                    tags: ['principle-tag'],
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
            }
        };

        // 1. Save the rich state
        const saveResult = await saveTeam(richState);
        expect(saveResult.success).toBe(true);

        // 2. Clear local state (simulate fresh load)
        // (In real app, we'd reload page, here we just trust loadTeam fetches from storage)

        // 3. Load the team back
        const loadedState = await loadTeam(richState.team!.teamId);
        expect(loadedState).not.toBeNull();

        if (loadedState) {
            // 4. Verify all metadata fields
            expect(loadedState.team!.teamName).toBe('Metadata Test Team');
            expect(loadedState.team!.purposeMetadata).toEqual({
                description: 'Detailed purpose description',
                tags: ['tag1', 'tag2']
            });

            expect(loadedState.mission!.description).toBe('Mission description');
            expect(loadedState.mission!.tags).toEqual(['mission-tag']);

            expect(loadedState.vision!.description).toBe('Vision description');
            expect(loadedState.vision!.tags).toEqual(['vision-tag']);

            expect(loadedState.strategy!.description).toBe('Strategy description');
            expect(loadedState.strategy!.tags).toEqual(['strategy-tag']);

            expect(loadedState.goals[0].description).toBe('Goal description');
            expect(loadedState.goals[0].tags).toEqual(['priority-high']);
            expect(loadedState.goals[0].strategyId).toBe('s1');

            expect(loadedState.values[0].description).toBe('Value description');
            expect(loadedState.values[0].tags).toEqual(['value-tag']);

            expect(loadedState.principles[0].description).toBe('Principle description');
            expect(loadedState.principles[0].tags).toEqual(['principle-tag']);
            expect(loadedState.principles[0].valueId).toBe('v1');

            expect(loadedState.behaviors[0].description).toBe('Behavior description');
            expect(loadedState.behaviors[0].tags).toEqual(['behavior-tag']);

            // 5. Verify graph persistence
            expect(loadedState.relationships).toHaveLength(1);
            expect(loadedState.relationships![0].id).toBe('manual-rel-1');

            expect(loadedState.graphLayout).toBeDefined();
            expect(loadedState.graphLayout.positions['v1']).toEqual({ x: 100, y: 200 });
        }
    });
});
