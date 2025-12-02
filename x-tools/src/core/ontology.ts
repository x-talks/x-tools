/**
 * Team Alignment Ontology
 * 
 * Hierarchical semantic model for team culture architecture
 * Supports relationship tracking, conflict detection, and AI analysis
 */

import { WizardState, RelationType, SemanticRelationship } from './types';

// ============================================================================
// SEMANTIC TAGS & CONCEPTS
// ============================================================================

export const SEMANTIC_CONCEPTS = {
    // Speed vs Quality dimension
    SPEED: ['fast', 'quick', 'rapid', 'agile', 'velocity', 'sprint', 'iterate'],
    QUALITY: ['quality', 'excellence', 'perfection', 'careful', 'thorough', 'rigorous'],

    // Innovation vs Stability dimension
    INNOVATION: ['innovation', 'creativity', 'experiment', 'bold', 'pioneer', 'disrupt'],
    STABILITY: ['stable', 'reliable', 'consistent', 'predictable', 'proven', 'traditional'],

    // Autonomy vs Control dimension
    AUTONOMY: ['autonomous', 'independent', 'freedom', 'empower', 'trust', 'decentralized'],
    CONTROL: ['control', 'oversight', 'governance', 'compliance', 'centralized', 'standardized'],

    // Collaboration vs Individual dimension
    COLLABORATION: ['team', 'together', 'collaborative', 'collective', 'shared', 'consensus'],
    INDIVIDUAL: ['individual', 'personal', 'ownership', 'accountability', 'merit', 'competition'],

    // Customer vs Business dimension
    CUSTOMER: ['customer', 'user', 'client', 'delight', 'experience', 'satisfaction'],
    BUSINESS: ['profit', 'revenue', 'growth', 'efficiency', 'shareholder', 'margin'],

    // Transparency vs Privacy dimension
    TRANSPARENCY: ['transparent', 'open', 'visible', 'public', 'share', 'communicate'],
    PRIVACY: ['private', 'confidential', 'secure', 'protected', 'discreet', 'internal'],
} as const;

export type ConceptCategory = keyof typeof SEMANTIC_CONCEPTS;

// ============================================================================
// SEMANTIC ANALYSIS
// ============================================================================

export interface SemanticTag {
    concept: ConceptCategory;
    confidence: number; // 0-1
    keywords: string[];
}

export interface SemanticAnalysis {
    itemId: string;
    itemType: 'value' | 'principle' | 'behavior' | 'mission' | 'vision';
    text: string;
    tags: SemanticTag[];
    sentiment: number; // -1 to 1
    complexity: number; // 0-100 (readability)
    specificity: number; // 0-100 (vague vs specific)
}

// ============================================================================
// CONFLICT DETECTION
// ============================================================================

export enum ConflictSeverity {
    HEALTHY_TENSION = 'healthy_tension',     // Expected, good to discuss
    POTENTIAL_CONFLICT = 'potential_conflict', // Warrants attention
    CRITICAL_CONFLICT = 'critical_conflict',   // Serious contradiction
}

export interface ConflictDetection {
    id: string;
    item1: { id: string; type: string; text: string };
    item2: { id: string; type: string; text: string };
    severity: ConflictSeverity;
    dimension: string; // e.g., "Speed vs Quality"
    explanation: string;
    suggestedResolution?: string;
}

// ============================================================================
// ONTOLOGY GRAPH
// ============================================================================

export interface OntologyNode {
    id: string;
    type: 'purpose' | 'vision' | 'mission' | 'strategy' | 'value' | 'principle' | 'behavior' | 'goal' | 'role';
    label: string;
    text?: string;
    layer: 'identity' | 'culture' | 'behavior' | 'execution';
    semanticTags: SemanticTag[];
    metadata: {
        createdAt: string;
        source: 'user' | 'system' | 'ai';
    };
}

export interface OntologyGraph {
    nodes: OntologyNode[];
    relationships: SemanticRelationship[];
    conflicts: ConflictDetection[];
}

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Extract semantic tags from text using keyword matching
 */
export function extractSemanticTags(text: string): SemanticTag[] {
    const lowerText = text.toLowerCase();
    const tags: SemanticTag[] = [];

    for (const [concept, keywords] of Object.entries(SEMANTIC_CONCEPTS)) {
        const matchedKeywords = keywords.filter(kw => lowerText.includes(kw));
        if (matchedKeywords.length > 0) {
            tags.push({
                concept: concept as ConceptCategory,
                confidence: Math.min(matchedKeywords.length / keywords.length, 1),
                keywords: matchedKeywords
            });
        }
    }

    return tags.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Detect conflicts between items based on semantic tags
 */
export function detectConflicts(
    item1: { id: string; type: string; text: string; tags: SemanticTag[] },
    item2: { id: string; type: string; text: string; tags: SemanticTag[] }
): ConflictDetection | null {

    const conflictPairs: [ConceptCategory, ConceptCategory, string][] = [
        ['SPEED', 'QUALITY', 'Speed vs Quality'],
        ['INNOVATION', 'STABILITY', 'Innovation vs Stability'],
        ['AUTONOMY', 'CONTROL', 'Autonomy vs Control'],
        ['COLLABORATION', 'INDIVIDUAL', 'Collaboration vs Individual'],
        ['CUSTOMER', 'BUSINESS', 'Customer vs Business'],
        ['TRANSPARENCY', 'PRIVACY', 'Transparency vs Privacy'],
    ];

    for (const [concept1, concept2, dimension] of conflictPairs) {
        const has1 = item1.tags.find(t => t.concept === concept1);
        const has2 = item2.tags.find(t => t.concept === concept2);

        if (has1 && has2 && has1.confidence > 0.3 && has2.confidence > 0.3) {
            const severity = (has1.confidence + has2.confidence) > 1.2
                ? ConflictSeverity.POTENTIAL_CONFLICT
                : ConflictSeverity.HEALTHY_TENSION;

            return {
                id: `conflict-${item1.id}-${item2.id}`,
                item1,
                item2,
                severity,
                dimension,
                explanation: `"${item1.text}" emphasizes ${concept1.toLowerCase()}, while "${item2.text}" emphasizes ${concept2.toLowerCase()}. This creates ${severity === ConflictSeverity.HEALTHY_TENSION ? 'healthy tension' : 'potential conflict'}.`,
                suggestedResolution: severity === ConflictSeverity.POTENTIAL_CONFLICT
                    ? `Consider clarifying when ${concept1.toLowerCase()} takes priority vs ${concept2.toLowerCase()}.`
                    : undefined
            };
        }
    }

    return null;
}

/**
 * Build ontology graph from wizard state
 */
export function buildOntologyGraph(state: WizardState): OntologyGraph {
    const nodes: OntologyNode[] = [];
    const relationships: SemanticRelationship[] = [];

    // Add identity layer nodes
    if (state.team?.teamPurpose) {
        nodes.push({
            id: 'purpose',
            type: 'purpose',
            label: 'Purpose',
            text: state.team.teamPurpose,
            layer: 'identity',
            semanticTags: extractSemanticTags(state.team.teamPurpose),
            metadata: { createdAt: state.team.createdAt, source: 'user' }
        });
    }

    if (state.vision?.text) {
        nodes.push({
            id: 'vision',
            type: 'vision',
            label: 'Vision',
            text: state.vision.text,
            layer: 'identity',
            semanticTags: extractSemanticTags(state.vision.text),
            metadata: { createdAt: new Date().toISOString(), source: 'user' }
        });
    }

    if (state.mission?.text) {
        nodes.push({
            id: 'mission',
            type: 'mission',
            label: 'Mission',
            text: state.mission.text,
            layer: 'identity',
            semanticTags: extractSemanticTags(state.mission.text),
            metadata: { createdAt: new Date().toISOString(), source: 'user' }
        });
    }

    // Add culture layer (values, principles)
    state.values.forEach(value => {
        nodes.push({
            id: value.id,
            type: 'value',
            label: value.label,
            text: value.explanation,
            layer: 'culture',
            semanticTags: extractSemanticTags(value.label + ' ' + value.explanation),
            metadata: { createdAt: new Date().toISOString(), source: value.source }
        });
    });

    state.principles.forEach(principle => {
        nodes.push({
            id: principle.id,
            type: 'principle',
            label: principle.label,
            layer: 'culture',
            semanticTags: extractSemanticTags(principle.label),
            metadata: { createdAt: new Date().toISOString(), source: 'user' }
        });

        // Create relationships: Principle derives from Values
        principle.derivedFromValues.forEach(valueId => {
            relationships.push({
                id: `rel-${principle.id}-${valueId}`,
                sourceId: principle.id,
                targetId: valueId,
                sourceType: 'principle',
                targetType: 'value',
                relationType: RelationType.DERIVES_FROM,
                strength: 80,
                confidence: 100,
                auto_detected: false
            });
        });
    });

    // Add behavior layer
    state.behaviors.forEach(behavior => {
        nodes.push({
            id: behavior.id,
            type: 'behavior',
            label: behavior.label,
            text: behavior.explanation,
            layer: 'behavior',
            semanticTags: extractSemanticTags(behavior.label + ' ' + behavior.explanation),
            metadata: { createdAt: new Date().toISOString(), source: 'user' }
        });

        // Create relationships: Behavior implements Values
        behavior.derivedFromValuesValues.forEach(valueId => {
            relationships.push({
                id: `rel-${behavior.id}-${valueId}`,
                sourceId: behavior.id,
                targetId: valueId,
                sourceType: 'behavior',
                targetType: 'value',
                relationType: RelationType.IMPLEMENTS,
                strength: 70,
                confidence: 100,
                auto_detected: false
            });
        });
    });

    // Add execution layer (goals)
    state.goals.forEach((goal, index) => {
        const goalId = `goal-${index}`;
        nodes.push({
            id: goalId,
            type: 'goal',
            label: goal,
            layer: 'execution',
            semanticTags: extractSemanticTags(goal),
            metadata: { createdAt: new Date().toISOString(), source: 'user' }
        });
    });

    // Add explicit relationships from state
    if (state.relationships) {
        relationships.push(...state.relationships);
    }

    // Detect conflicts
    const conflicts: ConflictDetection[] = [];
    const analyzableNodes = nodes.filter(n => n.text || n.label);

    for (let i = 0; i < analyzableNodes.length; i++) {
        for (let j = i + 1; j < analyzableNodes.length; j++) {
            const conflict = detectConflicts(
                { id: analyzableNodes[i].id, type: analyzableNodes[i].type, text: analyzableNodes[i].text || analyzableNodes[i].label, tags: analyzableNodes[i].semanticTags },
                { id: analyzableNodes[j].id, type: analyzableNodes[j].type, text: analyzableNodes[j].text || analyzableNodes[j].label, tags: analyzableNodes[j].semanticTags }
            );
            if (conflict) conflicts.push(conflict);
        }
    }

    return { nodes, relationships, conflicts };
}

/**
 * Enhance ontology graph with AI-detected semantic relationships
 * This automatically finds connections between nodes that weren't explicitly defined
 */
export async function enhanceWithAIRelationships(graph: OntologyGraph): Promise<OntologyGraph> {
    const { default: AI } = await import('./ai');

    if (!AI.isConfigured()) {
        // Skip AI enhancement if not configured
        return graph;
    }

    const newRelationships: SemanticRelationship[] = [...graph.relationships];
    const nodes = graph.nodes;

    // Only check nodes that don't already have relationships
    const nodePairs: Array<[OntologyNode, OntologyNode]> = [];

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const node1 = nodes[i];
            const node2 = nodes[j];

            // Skip if they're already connected
            const alreadyConnected = newRelationships.some(
                r => (r.sourceId === node1.id && r.targetId === node2.id) ||
                    (r.sourceId === node2.id && r.targetId === node1.id)
            );

            if (!alreadyConnected && node1.layer !== node2.layer) {
                nodePairs.push([node1, node2]);
            }
        }
    }

    // Limit to avoid too many API calls (max 10 checks)
    const limitedPairs = nodePairs.slice(0, 10);

    try {
        const results = await Promise.all(
            limitedPairs.map(async ([node1, node2]) => {
                const result = await AI.detectSemanticRelationships(
                    node1.text || node1.label,
                    node2.text || node2.label,
                    node1.type,
                    node2.type
                );
                return { node1, node2, result };
            })
        );

        results.forEach(({ node1, node2, result }) => {
            if (result.hasRelationship && result.strength && result.strength > 50) {
                newRelationships.push({
                    id: `ai-rel-${node1.id}-${node2.id}`,
                    sourceId: node1.id,
                    targetId: node2.id,
                    sourceType: node1.type as any,
                    targetType: node2.type as any,
                    relationType: (result.relationshipType as RelationType) || RelationType.REINFORCES,
                    strength: result.strength,
                    confidence: 75, // AI-detected, moderate confidence
                    explanation: result.explanation,
                    auto_detected: true
                });
            }
        });
    } catch (error) {
        console.error('AI relationship enhancement failed:', error);
    }

    return {
        ...graph,
        relationships: newRelationships
    };
}


/**
 * Calculate team health metrics
 */
export interface TeamHealthMetrics {
    alignmentScore: number; // 0-100
    completenessScore: number; // 0-100
    connectionDensity: number; // 0-100
    conflictScore: number; // 0-100 (lower is better)
    insights: string[];
}

export function calculateTeamHealth(state: WizardState, graph: OntologyGraph): TeamHealthMetrics {
    // Completeness
    const requiredFields = [
        state.team?.teamPurpose,
        state.vision?.text,
        state.mission?.text,
        state.values.length > 0,
        state.principles.length > 0,
        state.behaviors.length > 0
    ];
    const completenessScore = (requiredFields.filter(Boolean).length / requiredFields.length) * 100;

    // Connection density (how well connected is the graph?)
    const nodeCount = graph.nodes.length;
    const relationshipCount = graph.relationships.length;
    const maxPossibleConnections = (nodeCount * (nodeCount - 1)) / 2;
    const connectionDensity = maxPossibleConnections > 0
        ? (relationshipCount / maxPossibleConnections) * 100
        : 0;

    // Conflict score (number and severity of conflicts)
    const criticalConflicts = graph.conflicts.filter(c => c.severity === ConflictSeverity.CRITICAL_CONFLICT).length;
    const potentialConflicts = graph.conflicts.filter(c => c.severity === ConflictSeverity.POTENTIAL_CONFLICT).length;
    const conflictScore = Math.max(0, 100 - (criticalConflicts * 20 + potentialConflicts * 10));

    // Alignment score (weighted average)
    const alignmentScore = (
        completenessScore * 0.4 +
        connectionDensity * 0.3 +
        conflictScore * 0.3
    );

    // Generate insights
    const insights: string[] = [];
    if (completenessScore < 100) insights.push('Complete all required fields to improve alignment');
    if (connectionDensity < 30) insights.push('Add more connections between values, principles, and behaviors');
    if (criticalConflicts > 0) insights.push(`Resolve ${criticalConflicts} critical conflict(s)`);
    if (state.values.length < 3) insights.push('Consider adding more core values (3-7 recommended)');

    return {
        alignmentScore: Math.round(alignmentScore),
        completenessScore: Math.round(completenessScore),
        connectionDensity: Math.round(connectionDensity),
        conflictScore: Math.round(conflictScore),
        insights
    };
}
