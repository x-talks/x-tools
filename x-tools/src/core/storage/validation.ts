import { WizardState } from '../types';

export function validateTeamCompleteness(state: WizardState): {
    isComplete: boolean;
    missing: string[];
} {
    const missing: string[] = [];

    if (!state.team?.teamName) missing.push('Team Name');
    if (!state.team?.teamPurpose) missing.push('Purpose');
    if (!state.vision?.text) missing.push('Vision');
    if (!state.mission?.text) missing.push('Mission');
    if (!state.strategy?.text) missing.push('Strategy');
    if (state.values.length === 0) missing.push('Values');
    if (state.principles.length === 0) missing.push('Principles');
    if (state.behaviors.length === 0) missing.push('Behaviors');
    if (!state.goals || state.goals.length === 0) missing.push('Goals');

    return {
        isComplete: missing.length === 0,
        missing
    };
}
