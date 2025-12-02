import type { WizardState } from './types';

export interface VisualizationNode {
    id: string;
    label: string;
    type: 'purpose' | 'mission' | 'vision' | 'value' | 'behavior' | 'principle' | 'role' | 'person' | 'goal';
    teamId: string;
    data?: any;
}

export interface VisualizationEdge {
    from: string;
    to: string;
    teamId: string;
    label?: string;
}

export interface TeamVisualization {
    teamId: string;
    logo?: string;
    nodes: VisualizationNode[];
    edges: VisualizationEdge[];
}

export interface CombinedVisualization {
    nodes: VisualizationNode[];
    edges: VisualizationEdge[];
    visualizationHints: {
        colors: Record<string, string>;
        tooltips: Record<string, string>;
        layoutHints: {
            treeDirection: 'top-bottom' | 'left-right';
        };
    };
}

const COLORS = {
    mission: '#FFCC00',
    vision: '#FF6600',
    value: '#00CCFF',
    behavior: '#66CC66',
    principle: '#CC66FF',
    role: '#FF99CC',
    person: '#999999',
    purpose: '#E11D48', // Red-600
    goal: '#16A34A', // Green-600
};

export function transformToVisualization(teams: WizardState[]): CombinedVisualization {
    const allNodes: VisualizationNode[] = [];
    const allEdges: VisualizationEdge[] = [];

    teams.forEach((teamState) => {
        const teamId = teamState.team?.teamId || 'unknown';
        const nodes: VisualizationNode[] = [];
        const edges: VisualizationEdge[] = [];

        // Identity/Root Node
        const identityNodeId = `identity-${teamId}`;
        nodes.push({
            id: identityNodeId,
            label: teamState.team?.teamName || 'Team',
            type: 'mission', // Re-using mission type for identity node
            teamId,
            data: {
                text: teamState.team?.teamPurpose,
                logo: teamState.team?.logo
            }
        });

        // 1. Purpose Node
        if (teamState.team?.teamPurpose) {
            nodes.push({
                id: `purpose-${teamId}`,
                label: 'Purpose',
                type: 'purpose',
                teamId,
                data: { text: teamState.team.teamPurpose }
            });
            // Connect Identity to Purpose
            edges.push({ from: identityNodeId, to: `purpose-${teamId}`, teamId });
        }

        // 2. Vision Node
        if (teamState.vision) {
            nodes.push({
                id: `vision-${teamId}`,
                label: teamState.vision.archetype || 'Vision',
                type: 'vision',
                teamId,
                data: { text: teamState.vision.text }
            });
            // Connect Purpose to Vision
            if (teamState.team?.teamPurpose) {
                edges.push({ from: `purpose-${teamId}`, to: `vision-${teamId}`, teamId });
            }
        }

        // 3. Mission Node
        if (teamState.mission) {
            nodes.push({
                id: `mission-${teamId}`,
                label: 'Mission',
                type: 'mission',
                teamId,
                data: { text: teamState.mission.text }
            });
            // Connect Vision to Mission
            if (teamState.vision) {
                edges.push({ from: `vision-${teamId}`, to: `mission-${teamId}`, teamId });
            }
        }

        // 4. Values Nodes & Edges (Mission -> Value)
        teamState.values.forEach((val) => {
            const valNodeId = `value-${teamId}-${val.id}`;
            nodes.push({
                id: valNodeId,
                label: val.label,
                type: 'value',
                teamId,
            });

            if (teamState.mission) {
                edges.push({
                    from: `mission-${teamId}`,
                    to: valNodeId,
                    teamId,
                });
            }
        });

        // 5. Principles Nodes & Edges (Value -> Principle)
        teamState.principles.forEach((prin) => {
            const prinNodeId = `principle-${teamId}-${prin.id}`;
            nodes.push({
                id: prinNodeId,
                label: prin.label,
                type: 'principle',
                teamId,
            });

            prin.derivedFromValues.forEach((sourceId) => {
                // Link from Value node
                edges.push({
                    from: `value-${teamId}-${sourceId}`,
                    to: prinNodeId,
                    teamId,
                });
            });
        });

        // 6. Behaviors Nodes & Edges (Value -> Behavior, Principle -> Behavior)
        teamState.behaviors.forEach((beh) => {
            const behNodeId = `behavior-${teamId}-${beh.id}`;
            nodes.push({
                id: behNodeId,
                label: beh.label,
                type: 'behavior',
                teamId,
            });

            // Connect from Values
            beh.derivedFromValuesValues.forEach((valId) => {
                edges.push({
                    from: `value-${teamId}-${valId}`,
                    to: behNodeId,
                    teamId,
                });
            });
        });

        // 7. Goals Nodes & Edges (Behavior -> Goal)
        if (teamState.goals && teamState.goals.length > 0) {
            teamState.goals.forEach((goal, idx) => {
                const goalNodeId = `goal-${teamId}-${idx}`;
                nodes.push({
                    id: goalNodeId,
                    label: goal,
                    type: 'goal',
                    teamId,
                    data: { text: goal }
                });

                // Connect from Behaviors (if any exist)
                if (teamState.behaviors.length > 0) {
                    // Connect first behavior to each goal for simplicity
                    // In a more complex system, you could track which behaviors relate to which goals
                    const firstBehavior = teamState.behaviors[0];
                    edges.push({
                        from: `behavior-${teamId}-${firstBehavior.id}`,
                        to: goalNodeId,
                        teamId,
                    });
                }
            });
        }

        // 8. Roles
        teamState.roles.forEach(role => {
            const roleId = `role-${teamId}-${role.replace(/\s+/g, '-').toLowerCase()}`;
            nodes.push({ id: roleId, label: role, type: 'role', teamId });
            // Connect Role to Mission (Central Hub)
            if (teamState.mission) {
                edges.push({ from: `mission-${teamId}`, to: roleId, teamId, label: 'has role' });
            }
        });

        // 9. People
        teamState.people.forEach(person => {
            const personId = `person-${teamId}-${person.id}`;
            nodes.push({ id: personId, label: person.name, type: 'person', teamId });

            // Connect Person to Role
            const roleId = `role-${teamId}-${person.role.replace(/\s+/g, '-').toLowerCase()}`;
            edges.push({ from: personId, to: roleId, teamId, label: 'assigned to' });
        });

        allNodes.push(...nodes);
        allEdges.push(...edges);
    });

    return {
        nodes: allNodes,
        edges: allEdges,
        // We can attach team-level metadata here if we want to support single-team logo in the combined view
        // For now, let's just ensure nodes have what they need.
        // But wait, the user wants the logo in the canvas.
        // Let's add a special "Team Identity" node or just pass it in the hints?
        // Or better, let's add it to the return type if we change CombinedVisualization.
        // Actually, let's just add a 'logo' node for the team?
        // Or simpler: let's add it to the 'mission' node data or a new 'identity' node.
        // Let's add a 'identity' node which is the central hub.
        visualizationHints: {
            colors: COLORS,
            tooltips: {}, // Can be populated if needed
            layoutHints: {
                treeDirection: 'left-right',
            },
        },
    };
}
