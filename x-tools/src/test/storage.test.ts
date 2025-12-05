import { describe, it, expect, beforeEach } from 'vitest';
import { validateTeamCompleteness, saveTeam, loadTeam, getSavedTeams, deleteTeam } from '../core/storage';
import type { WizardState } from '../core/types';

describe('Storage Functions', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('validateTeamCompleteness', () => {
        it('should return incomplete for empty state', () => {
            const state: WizardState = {
                team: null,
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

            const result = validateTeamCompleteness(state);
            expect(result.isComplete).toBe(false);
            expect(result.missing).toContain('Team Name');
            expect(result.missing).toContain('Purpose');
            expect(result.missing).toContain('Vision');
            expect(result.missing).toContain('Mission');
            expect(result.missing).toContain('Values');
            expect(result.missing).toContain('Principles');
            expect(result.missing).toContain('Behaviors');
            expect(result.missing).toContain('Goals');
        });

        it('should return complete for fully populated state', () => {
            const state: WizardState = {
                team: {
                    teamId: 'test-id',
                    teamName: 'Test Team',
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

            const result = validateTeamCompleteness(state);
            expect(result.isComplete).toBe(true);
            expect(result.missing).toHaveLength(0);
        });

        it('should detect missing goals', () => {
            const state: WizardState = {
                team: {
                    teamId: 'test-id',
                    teamName: 'Test Team',
                    teamPurpose: 'Test Purpose',
                    goals: [],
                    createdAt: new Date().toISOString(),
                    createdBy: 'test-user'
                },
                mission: { text: 'Test Mission', keywords: [] },
                vision: { text: 'Test Vision', archetype: 'The Pioneer' },
                goals: [], // Empty goals
                values: [{ id: 'v1', label: 'Value 1', source: 'user', explanation: 'Test' }],
                behaviors: [{ id: 'b1', label: 'Behavior 1', derivedFromValues: ['v1'], explanation: 'Test', ruleId: 'r1' }],
                principles: [{ id: 'p1', label: 'Principle 1', derivedFromValues: ['v1'], explanation: 'Test principle' }],
                roles: [],
                people: [],
                auditLog: [],
                currentStep: 0
            };

            const result = validateTeamCompleteness(state);
            expect(result.isComplete).toBe(false);
            expect(result.missing).toContain('Goals');
        });
    });

    describe('saveTeam', () => {
        it('should reject incomplete teams', async () => {
            const state: WizardState = {
                team: { teamId: 'test', teamName: 'Test', teamPurpose: '', goals: [], createdAt: '', createdBy: '' },
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

            const result = await saveTeam(state);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });

        it('should save complete teams', async () => {
            const state: WizardState = {
                team: {
                    teamId: 'test-id',
                    teamName: 'Test Team',
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

            const result = await saveTeam(state);
            expect(result.success).toBe(true);
            expect(result.savedTeam).toBeDefined();
            expect(result.savedTeam?.name).toBe('Test Team');
        });
    });

    describe('loadTeam', () => {
        it('should load saved team', async () => {
            const state: WizardState = {
                team: {
                    teamId: 'test-id',
                    teamName: 'Test Team',
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

            await saveTeam(state);
            const loaded = await loadTeam('test-id');

            expect(loaded).toBeDefined();
            expect(loaded?.team?.teamName).toBe('Test Team');
            expect(loaded?.goals).toEqual([{ id: 'g1', text: 'Goal 1', description: '', tags: [] }]);
        });

        it('should return null for non-existent team', async () => {
            const loaded = await loadTeam('non-existent');
            expect(loaded).toBeNull();
        });
    });

    describe('deleteTeam', () => {
        it('should delete team', async () => {
            const state: WizardState = {
                team: {
                    teamId: 'test-id',
                    teamName: 'Test Team',
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

            await saveTeam(state);
            const teams1 = await getSavedTeams();
            expect(teams1).toHaveLength(1);

            await deleteTeam('test-id');
            const teams2 = await getSavedTeams();
            expect(teams2).toHaveLength(0);
        });
    });
});
