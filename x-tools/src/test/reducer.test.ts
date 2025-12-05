import { describe, it, expect } from 'vitest';
import type { WizardState } from '../core/types';
import { wizardReducer } from '../core/store';

describe('Wizard Reducer', () => {
    const initialState: WizardState = {
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

    it('should handle SET_GOALS', () => {
        const goals = [
            { id: 'g1', text: 'Goal 1', description: '', tags: [] },
            { id: 'g2', text: 'Goal 2', description: '', tags: [] }
        ];
        const newState = wizardReducer(initialState, { type: 'SET_GOALS', payload: goals });

        expect(newState.goals).toEqual(goals);
        expect(newState.auditLog).toHaveLength(1);
        expect(newState.auditLog[0].details).toBe('Goals updated');
    });

    it('should handle LOAD_STATE', () => {
        const loadedState: WizardState = {
            ...initialState,
            team: { teamId: 'test', teamName: 'Test', teamPurpose: 'Test', goals: [], createdAt: '', createdBy: '' },
            goals: [{ id: 'lg1', text: 'Loaded Goal', description: '', tags: [] }],
            currentStep: 5
        };

        const newState = wizardReducer(initialState, { type: 'LOAD_STATE', payload: loadedState });

        expect(newState.team?.teamName).toBe('Test');
        expect(newState.goals).toEqual([{ id: 'lg1', text: 'Loaded Goal', description: '', tags: [] }]);
        expect(newState.currentStep).toBe(5);
        expect(newState.auditLog[newState.auditLog.length - 1].details).toBe('Team loaded from storage');
    });

    it('should handle GO_TO_STEP', () => {
        const newState = wizardReducer(initialState, { type: 'GO_TO_STEP', payload: 9 });

        expect(newState.currentStep).toBe(9);
    });

    it('should handle NEXT_STEP', () => {
        const newState = wizardReducer(initialState, { type: 'NEXT_STEP' });

        expect(newState.currentStep).toBe(1);
    });

    it('should handle PREV_STEP', () => {
        const stateAtStep5 = { ...initialState, currentStep: 5 };
        const newState = wizardReducer(stateAtStep5, { type: 'PREV_STEP' });

        expect(newState.currentStep).toBe(4);
    });

    it('should not go below step 0 with PREV_STEP', () => {
        const newState = wizardReducer(initialState, { type: 'PREV_STEP' });

        expect(newState.currentStep).toBe(0);
    });

    it('should handle RESET', () => {
        const populatedState: WizardState = {
            ...initialState,
            team: { teamId: 'test', teamName: 'Test', teamPurpose: 'Test', goals: [], createdAt: '', createdBy: '' },
            goals: [{ id: 'g1', text: 'Goal', description: '', tags: [] }],
            currentStep: 7
        };

        const newState = wizardReducer(populatedState, { type: 'RESET' });

        expect(newState.team).toBeNull();
        expect(newState.goals).toEqual([]);
        expect(newState.currentStep).toBe(0);
    });
});
