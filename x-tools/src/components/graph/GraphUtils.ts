import { OntologyGraph } from '../../core/ontology';
import type { Node, Edge, MarkerType } from 'reactflow';

// Wizard Stage Colors
export const WIZARD_STAGE_COLORS: Record<string, { background: string; color: string }> = {
    Circle: { background: '#FFD700', color: '#000' },
    Purpose: { background: '#FFA500', color: '#000' },
    Vision: { background: '#8A2BE2', color: '#fff' },
    Mission: { background: '#00BFFF', color: '#fff' },
    Strategy: { background: '#32CD32', color: '#000' },
    Values: { background: '#FF69B4', color: '#fff' },
    Principles: { background: '#FF4500', color: '#fff' },
    Behaviors: { background: '#00CED1', color: '#000' },
    // Fallback colors for entity types
    purpose: { background: '#FFA500', color: '#000' },
    vision: { background: '#8A2BE2', color: '#fff' },
    mission: { background: '#00BFFF', color: '#fff' },
    strategy: { background: '#32CD32', color: '#000' },
    value: { background: '#FF69B4', color: '#fff' },
    principle: { background: '#FF4500', color: '#fff' },
    behavior: { background: '#00CED1', color: '#000' },
    goal: { background: '#FFD700', color: '#000' },
    role: { background: '#E2E8F0', color: '#000' },
};

/**
 * Convert OntologyGraph to React Flow compatible format
 */
export function convertOntologyToReactFlow(ontology: OntologyGraph): { nodes: Node[]; edges: Edge[] } {
    // Create a map to track node positions by type for auto-layout
    const typeYPositions: Record<string, number> = {
        purpose: 50,
        vision: 150,
        mission: 250,
        strategy: 350,
        value: 450,
        principle: 550,
        behavior: 650,
        goal: 750,
        role: 850
    };

    const typeXOffsets: Record<string, number> = {};

    const nodes: Node[] = ontology.nodes.map((node) => {
        const entityType = node.type.charAt(0).toUpperCase() + node.type.slice(1);
        const styleConfig = WIZARD_STAGE_COLORS[entityType] || WIZARD_STAGE_COLORS[node.type] || { background: '#E2E8F0', color: '#000' };

        // Auto-layout: assign position based on type
        const yPos = typeYPositions[node.type] || 50;
        const xOffset = typeXOffsets[node.type] || 0;
        typeXOffsets[node.type] = xOffset + 300;

        return {
            id: node.id,
            type: 'default',
            data: {
                label: node.label.length > 50 ? node.label.substring(0, 50) + '...' : node.label,
                content: node.label,
                description: node.description || node.text || node.label,
                tags: node.tags || [],
                entityType: node.type
            },
            position: { x: 100 + xOffset, y: yPos },
            style: {
                background: styleConfig.background,
                color: styleConfig.color,
                border: '2px solid ' + styleConfig.background,
                borderRadius: '8px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: 500,
                minWidth: '200px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }
        };
    });

    const edges: Edge[] = ontology.relationships.map((rel) => {
        const isConflict = rel.relationType === 'conflicts_with';
        return {
            id: rel.id,
            source: rel.sourceId,
            target: rel.targetId,
            label: rel.relationType.replace(/_/g, ' '),
            animated: rel.auto_detected || false,
            style: {
                stroke: isConflict ? '#ef4444' : '#94a3b8',
                strokeWidth: rel.strength ? Math.max(1, rel.strength / 20) : 1,
                strokeDasharray: rel.auto_detected ? '5,5' : undefined
            },
            labelStyle: {
                fill: '#64748b',
                fontSize: 10
            },
            markerEnd: {
                type: 'arrow' as MarkerType,
                color: isConflict ? '#ef4444' : '#94a3b8'
            }
        };
    });

    // Add conflict edges
    ontology.conflicts.forEach((conflict) => {
        edges.push({
            id: conflict.id,
            source: conflict.item1.id,
            target: conflict.item2.id,
            label: '⚠️ Conflict',
            animated: true,
            style: {
                stroke: '#f59e0b',
                strokeWidth: 2,
                strokeDasharray: '5,5'
            },
            labelStyle: {
                fill: '#f59e0b',
                fontSize: 10,
                fontWeight: 'bold'
            },
            markerEnd: {
                type: 'arrow' as MarkerType,
                color: '#f59e0b'
            }
        });
    });

    return { nodes, edges };
}
