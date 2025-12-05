import { describe, it, expect, beforeEach } from 'vitest';
import { saveTeam, getSavedTeams } from '../core/storage';
import type { WizardState } from '../core/types';

describe('Critical User Flows', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('Goals Persistence', () => {
        it('should save and load goals correctly', async () => {
            const state: WizardState = {
                team: {
                    teamId: 'test-id',
                    teamName: 'Test Team',
                    teamPurpose: 'Test Purpose',
                    goals: [
                        { id: 'g1', text: 'Goal 1', description: '', tags: [] },
                        { id: 'g2', text: 'Goal 2', description: '', tags: [] }
                    ],
                    createdAt: new Date().toISOString(),
                    createdBy: 'test-user'
                },
                mission: { text: 'Test Mission', keywords: [] },
                vision: { text: 'Test Vision', archetype: 'The Pioneer' },
                goals: [
                    { id: 'g1', text: 'Goal 1', description: '', tags: [] },
                    { id: 'g2', text: 'Goal 2', description: '', tags: [] }
                ],
                values: [{ id: 'v1', label: 'Value 1', source: 'user', explanation: 'Test' }],
                behaviors: [{ id: 'b1', label: 'Behavior 1', derivedFromValues: ['v1'], explanation: 'Test', ruleId: 'r1' }],
                principles: [{ id: 'p1', label: 'Principle 1', derivedFromValues: ['v1'], explanation: 'Test principle' }],
                roles: [],
                people: [],
                auditLog: [],
                currentStep: 0
            };

            const result = await saveTeam(state);
            expect(result.success).toBe(true);

            const teams = await getSavedTeams();
            expect(teams).toHaveLength(1);
            expect(teams[0].state.goals).toEqual([
                { id: 'g1', text: 'Goal 1', description: '', tags: [] },
                { id: 'g2', text: 'Goal 2', description: '', tags: [] }
            ]);
        });
    });

    describe('Save Validation', () => {
        it('should prevent saving incomplete teams', async () => {
            const incompleteState: WizardState = {
                team: { teamId: 'test', teamName: 'Test', teamPurpose: 'Test', goals: [], createdAt: '', createdBy: '' },
                mission: null,
                vision: null,
                goals: [],
                values: [],
                behaviors: [],
                principles: [],
                roles: [],
                people: [],
                auditLog: [],
                currentStep: 0
            };

            const result = await saveTeam(incompleteState);
            expect(result.success).toBe(false);
            expect(result.error).toContain('incomplete');
        });

        it('should allow saving complete teams', async () => {
            const completeState: WizardState = {
                team: {
                    teamId: 'test-id',
                    teamName: 'Complete Team',
                    teamPurpose: 'Test Purpose',
                    goals: [{ id: 'g1', text: 'Goal 1', description: '', tags: [] }],
                    createdAt: new Date().toISOString(),
                    createdBy: 'test-user'
                },
                mission: { text: 'Test Mission', keywords: [] },
                vision: { text: 'Test Vision', archetype: 'The Pioneer' },
                goals: [{ id: 'g1', text: 'Goal 1', description: '', tags: [] }],
                values: [{ id: 'v1', label: 'Value 1', source: 'user', explanation: 'Test' }],
                behaviors: [{ id: 'b1', label: 'Behavior 1', derivedFromValues: ['v1'], explanation: 'Test', ruleId: 'r1' }],
                principles: [{ id: 'p1', label: 'Principle 1', derivedFromValues: ['v1'], explanation: 'Test principle' }],
                roles: [],
                people: [],
                auditLog: [],
                currentStep: 0
            };

            const result = await saveTeam(completeState);
            expect(result.success).toBe(true);
            expect(result.savedTeam?.name).toBe('Complete Team');
        });
    });

    describe('Multiple Teams', () => {
        it('should allow creating and saving multiple teams', async () => {
            const team1: WizardState = {
                team: {
                    teamId: 'team-1',
                    teamName: 'Team One',
                    teamPurpose: 'Purpose 1',
                    goals: [{ id: 'g1', text: 'Goal 1', description: '', tags: [] }],
                    createdAt: new Date().toISOString(),
                    createdBy: 'test-user'
                },
                mission: { text: 'Mission 1', keywords: [] },
                vision: { text: 'Vision 1', archetype: 'The Pioneer' },
                goals: [{ id: 'g1', text: 'Goal 1', description: '', tags: [] }],
                values: [{ id: 'v1', label: 'Value 1', source: 'user', explanation: 'Test' }],
                behaviors: [{ id: 'b1', label: 'Behavior 1', derivedFromValues: ['v1'], explanation: 'Test', ruleId: 'r1' }],
                principles: [{ id: 'p1', label: 'Principle 1', derivedFromValues: ['v1'], explanation: 'Test principle' }],
                roles: [],
                people: [],
                auditLog: [],
                currentStep: 0
            };

            const team2: WizardState = {
                ...team1,
                team: {
                    teamId: 'team-2',
                    teamName: 'Team Two',
                    teamPurpose: 'Purpose 2',
                    goals: [{ id: 'g2', text: 'Goal 2', description: '', tags: [] }],
                    createdAt: new Date().toISOString(),
                    createdBy: 'test-user'
                },
                goals: [{ id: 'g2', text: 'Goal 2', description: '', tags: [] }]
            };

            const result1 = await saveTeam(team1);
            const result2 = await saveTeam(team2);

            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);

            const teams = JSON.parse(localStorage.getItem('teamDataArray') || '[]');
            expect(teams).toHaveLength(2);
            expect(teams[0].name).toBe('Team One');
            expect(teams[1].name).toBe('Team Two');
        });
    });
});
