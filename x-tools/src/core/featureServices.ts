import { WizardState, ValidationResult, TeamInsight, RelationType, SemanticRelationship } from './types';

// Feature 1: Smart Validation & Guidance
export const SmartValidator = {
    validatePurpose: (text: string): ValidationResult => {
        const issues: ValidationResult['issues'] = [];
        let score = 100;

        if (text.length < 10) {
            score -= 50;
            issues.push({ severity: 'critical', message: 'Purpose is too short (min 10 chars)', field: 'text' });
        } else if (text.length < 50) {
            score -= 20;
            issues.push({ severity: 'warning', message: 'Purpose could be more descriptive', field: 'text' });
        }

        if (!text.toLowerCase().includes('customer') && !text.toLowerCase().includes('user') && !text.toLowerCase().includes('world') && !text.toLowerCase().includes('people')) {
            score -= 10;
            issues.push({ severity: 'suggestion', message: 'Consider mentioning who you serve (users, customers, etc.)', field: 'text' });
        }

        return {
            score,
            status: score > 80 ? 'excellent' : score > 60 ? 'valid' : score > 30 ? 'warning' : 'critical',
            issues,
            lastValidated: new Date().toISOString()
        };
    },

    validateState: (state: WizardState): ValidationResult => {
        // Aggregate validation logic
        const issues: ValidationResult['issues'] = [];
        let totalScore = 0;
        let checks = 0;

        // Check Team Basics
        if (state.team?.teamName) {
            totalScore += 100;
        } else {
            issues.push({ severity: 'critical', message: 'Team name is missing', field: 'team' });
        }
        checks++;

        // Check Purpose/Mission/Vision
        const pmvCount = [state.team?.teamPurpose, state.mission?.text, state.vision?.text].filter(Boolean).length;
        if (pmvCount === 3) totalScore += 100;
        else if (pmvCount > 0) totalScore += 50;
        else issues.push({ severity: 'warning', message: 'Define Purpose, Mission, and Vision for clarity', field: 'identity' });
        checks++;

        // Check Values
        if (state.values.length >= 3) {
            totalScore += 100;
        } else if (state.values.length > 0) {
            totalScore += 50;
            issues.push({ severity: 'suggestion', message: 'Values are sparse. Aim for 3-5 core values.', field: 'values' });
        } else {
            issues.push({ severity: 'warning', message: 'No values defined.', field: 'values' });
        }
        checks++;

        // Check Goals
        if (state.goals.length > 0) {
            totalScore += 100;
        } else {
            issues.push({ severity: 'critical', message: 'No goals defined. What is the team aiming for?', field: 'goals' });
        }
        checks++;

        const finalScore = checks > 0 ? Math.round(totalScore / checks) : 0;

        return {
            score: finalScore,
            status: finalScore > 80 ? 'excellent' : finalScore > 60 ? 'valid' : finalScore > 40 ? 'warning' : 'critical',
            issues,
            lastValidated: new Date().toISOString()
        };
    }
};

// Feature 12: AI Coach (Heuristic based)
export const AICoach = {
    analyze: (state: WizardState): TeamInsight[] => {
        const insights: TeamInsight[] = [];
        const now = new Date().toISOString();

        // Check for empty goals
        if (state.goals.length === 0) {
            insights.push({
                id: 'insight-goals-empty',
                type: 'drift_alert',
                severity: 'high',
                message: 'Your team has no defined goals. Goals are critical for execution.',
                generatedAt: now,
                metric: 'Goal Count: 0'
            });
        }

        // Check alignment: Principles vs Values
        if (state.values.length > 0 && state.principles.length === 0) {
            insights.push({
                id: 'insight-principle-gap',
                type: 'alignment_score',
                severity: 'medium',
                message: 'You have values but no principles. Principles help translate values into action.',
                generatedAt: now
            });
        }

        // Check alignment: Behaviors vs Principles
        if (state.principles.length > 0 && state.behaviors.length < state.principles.length) {
            insights.push({
                id: 'insight-behavior-gap',
                type: 'suggestion',
                severity: 'low',
                message: 'Try to define at least one behavior for every principle to ensure it is actionable.',
                generatedAt: now
            });
        }

        return insights;
    }
};

// Feature 3: Relationship Intelligence (Heuristics)
export const RelationshipIntelligence = {
    detectConflicts: (state: WizardState): SemanticRelationship[] => {
        const conflicts: SemanticRelationship[] = [];

        // Example conflict: "Speed" in values vs "Quality" in values (classic tension)
        // This is a naive heuristic for demonstration
        const hasSpeed = state.values.find(v => v.label.toLowerCase().includes('speed') || v.label.toLowerCase().includes('fast'));
        const hasQuality = state.values.find(v => v.label.toLowerCase().includes('quality') || v.label.toLowerCase().includes('perfect'));

        if (hasSpeed && hasQuality) {
            conflicts.push({
                id: `conflict-${Date.now()}`,
                sourceId: hasSpeed.id,
                targetId: hasQuality.id,
                sourceType: 'value',
                targetType: 'value',
                relationType: RelationType.CONFLICTS_WITH,
                strength: 50,
                confidence: 70,
                auto_detected: true,
                explanation: 'Speed and Perfection can be in tension. Ensure you have principles to balance them.'
            });
        }

        return conflicts;
    }
};

// Feature 2: Intelligent Defaults & Templates
export const TemplateService = {
    getTemplates: (industry: string) => {
        // Mock template return
        if (industry === 'tech') {
            return {
                values: ['Move Fast', 'Be Open', 'Focus on Impact'],
                principles: ['Code Wins Arguments', 'Deploy Early']
            };
        }
        return {
            values: ['Integrity', 'Excellence', 'Respect'],
            principles: ['Customer First', 'Quality Over Quantity']
        };
    }
};
