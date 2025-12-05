import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react';
import type { WizardState, Team, Mission, Vision, Value, Behavior, Principle, AuditLogEntry, Role, Person, Strategy, Goal, SemanticRelationship } from './types';
import { useHistory } from '../hooks/useHistory';

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
    currentStep: 0,
    relationships: [],
};

type Action =
    | { type: 'SET_TEAM'; payload: Team }
    | { type: 'SET_MISSION'; payload: Mission }
    | { type: 'SET_VISION'; payload: Vision }
    | { type: 'SET_GOALS'; payload: Goal[] }
    | { type: 'SET_VALUES'; payload: Value[] }
    | { type: 'SET_BEHAVIORS'; payload: Behavior[] }
    | { type: 'SET_PRINCIPLES'; payload: Principle[] }
    | { type: 'SET_STRATEGY'; payload: Strategy }
    | { type: 'SET_ROLES'; payload: Role[] }
    | { type: 'SET_PEOPLE'; payload: Person[] }
    | { type: 'SET_RELATIONSHIPS'; payload: SemanticRelationship[] }
    | { type: 'SET_GRAPH_LAYOUT'; payload: any }
    | { type: 'UPDATE_NODE_METADATA'; payload: { nodeId: string; entityType: string; label: string; description?: string; tags?: string[]; color?: string; textColor?: string; emoji?: string } }
    | { type: 'LOAD_STATE'; payload: WizardState }
    | { type: 'NEXT_STEP' }
    | { type: 'PREV_STEP' }
    | { type: 'RESET' }
    | { type: 'GO_TO_STEP'; payload: number };

export function wizardReducer(state: WizardState, action: Action): WizardState {
    const now = new Date().toISOString();
    let logEntry: AuditLogEntry | null = null;

    switch (action.type) {
        case 'SET_TEAM':
            logEntry = { user: 'current-user', action: 'created', ts: now, details: `Team created: ${action.payload.teamName}` };
            return { ...state, team: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_MISSION':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'Mission updated' };
            return { ...state, mission: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_VISION':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'Vision updated' };
            return { ...state, vision: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_STRATEGY':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'Strategy updated' };
            return { ...state, strategy: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_GOALS':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'Goals updated' };
            return { ...state, goals: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_VALUES':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'Values updated' };
            return { ...state, values: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_BEHAVIORS':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'Behaviors updated' };
            return { ...state, behaviors: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_PRINCIPLES':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'Principles updated' };
            return { ...state, principles: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_ROLES':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'Roles updated' };
            return { ...state, roles: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_PEOPLE':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'People updated' };
            return { ...state, people: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_RELATIONSHIPS':
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: 'Relationships updated' };
            return { ...state, relationships: action.payload, auditLog: [...state.auditLog, logEntry] };
        case 'SET_GRAPH_LAYOUT':
            return { ...state, graphLayout: action.payload };
        case 'UPDATE_NODE_METADATA': {
            const { nodeId, entityType, label, description, tags } = action.payload;
            logEntry = { user: 'current-user', action: 'edited', ts: now, details: `Updated ${entityType}: ${label}` };

            // Update the appropriate entity based on type
            switch (entityType.toLowerCase()) {
                case 'purpose':
                    if (state.team) {
                        return {
                            ...state,
                            team: {
                                ...state.team,
                                teamPurpose: label,
                                purposeMetadata: { ...state.team.purposeMetadata, description, tags }
                            },
                            auditLog: [...state.auditLog, logEntry]
                        };
                    }
                    break;
                case 'vision':
                    if (state.vision) {
                        return {
                            ...state,
                            vision: { ...state.vision, text: label, description, tags },
                            auditLog: [...state.auditLog, logEntry]
                        };
                    }
                    break;
                case 'mission':
                    if (state.mission) {
                        return {
                            ...state,
                            mission: { ...state.mission, text: label, description, tags },
                            auditLog: [...state.auditLog, logEntry]
                        };
                    }
                    break;
                case 'strategy':
                    if (state.strategy) {
                        return {
                            ...state,
                            strategy: { ...state.strategy, text: label, description, tags },
                            auditLog: [...state.auditLog, logEntry]
                        };
                    }
                    break;
                case 'value':
                    return {
                        ...state,
                        values: state.values.map(v =>
                            v.id === nodeId ? { ...v, label, description, tags } : v
                        ),
                        auditLog: [...state.auditLog, logEntry]
                    };
                case 'principle':
                    return {
                        ...state,
                        principles: state.principles.map(p =>
                            p.id === nodeId ? { ...p, label, description, tags } : p
                        ),
                        auditLog: [...state.auditLog, logEntry]
                    };
                case 'behavior':
                    return {
                        ...state,
                        behaviors: state.behaviors.map(b =>
                            b.id === nodeId ? { ...b, label, description, tags } : b
                        ),
                        auditLog: [...state.auditLog, logEntry]
                    };
                case 'goal':
                    return {
                        ...state,
                        goals: state.goals.map(g =>
                            g.id === nodeId ? { ...g, text: label, description, tags } : g
                        ),
                        auditLog: [...state.auditLog, logEntry]
                    };
                default:
                    return state;
            }
            return state;
        }
        case 'LOAD_STATE':
            return { ...action.payload, auditLog: [...action.payload.auditLog, { user: 'system', action: 'edited', ts: now, details: 'Team loaded from storage' }] };
        case 'NEXT_STEP':
            return { ...state, currentStep: state.currentStep + 1 };
        case 'PREV_STEP':
            return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
        case 'RESET':
            return initialState;
        case 'GO_TO_STEP':
            return { ...state, currentStep: action.payload };
        default:
            return state;
    }
}

const WizardContext = createContext<{
    state: WizardState;
    dispatch: React.Dispatch<Action>;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
} | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
    // Import useHistory dynamically to avoid circular dependencies if any, 
    // but here we can just assume it's available or import at top level.
    // For now, I'll use the hook logic directly or import it.
    // Let's assume import is added at top.

    // We need to use the reducer logic but managed by history
    // Since useHistory manages the state, we need to bridge them.

    const { state, set, undo, redo, canUndo, canRedo, reset } = useHistory(initialState);

    const dispatch = (action: Action) => {
        if (action.type === 'RESET') {
            reset(initialState);
            return;
        }

        const newState = wizardReducer(state, action);
        set(newState);
    };

    return (
        <WizardContext.Provider value={{ state, dispatch, undo, redo, canUndo, canRedo }}>
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error('useWizard must be used within a WizardProvider');
    }
    return context;
}
