import { RelationType } from '../../core/types';
import { OntologyGraph } from '../../core/ontology';
import { Options } from 'vis-network';

export interface VisNode {
    id: string;
    label: string;
    group: string;
    title?: string;
    value?: number;
    color?: string | { background: string; border: string; highlight?: { background: string; border: string } };
    shape?: string;
    font?: { color: string; size?: number; face?: string };
    borderWidth?: number;
    shadow?: boolean;
    x?: number;
    y?: number;
}

export interface VisEdge {
    id: string;
    from: string;
    to: string;
    label?: string;
    dashes?: boolean;
    width?: number;
    color?: { color: string };
    arrows?: string;
    font?: { align: string; size: number; color: string; strokeWidth: number };
    smooth?: { enabled: boolean; type: string; roundness?: number } | boolean;
}

export const LAYER_COLORS = {
    identity: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    culture: { bg: '#fce7f3', border: '#ec4899', text: '#9f1239' },
    behavior: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
    execution: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
};

export const NODE_GROUPS = {
    purpose: { color: LAYER_COLORS.identity, shape: 'hexagon', size: 30 },
    vision: { color: LAYER_COLORS.identity, shape: 'diamond', size: 25 },
    mission: { color: LAYER_COLORS.identity, shape: 'dot', size: 25 },
    strategy: { color: LAYER_COLORS.identity, shape: 'box', size: 20 },
    value: { color: LAYER_COLORS.culture, shape: 'dot', size: 20 },
    principle: { color: LAYER_COLORS.culture, shape: 'triangle', size: 15 },
    behavior: { color: LAYER_COLORS.behavior, shape: 'square', size: 15 },
    goal: { color: LAYER_COLORS.execution, shape: 'star', size: 20 },
    role: { color: { bg: '#e2e8f0', border: '#64748b', text: '#0f172a' }, shape: 'ellipse', size: 15 },
};

export function convertOntologyToVis(ontology: OntologyGraph) {
    const nodes = ontology.nodes.map((node) => {
        const groupStyle = NODE_GROUPS[node.type as keyof typeof NODE_GROUPS] || { color: { bg: '#ccc', border: '#999', text: '#000' }, shape: 'dot' };

        return {
            id: node.id,
            label: node.label.length > 20 ? node.label.substring(0, 20) + '...' : node.label,
            group: node.type,
            title: `<b>${node.type.toUpperCase()}</b><br/>${node.text || node.label}`,
            shape: groupStyle.shape,
            color: {
                background: groupStyle.color.bg,
                border: groupStyle.color.border,
                highlight: { background: groupStyle.color.border, border: groupStyle.color.text },
            },
            font: { color: groupStyle.color.text, size: 12, face: 'Inter' },
            borderWidth: 2,
            shadow: true,
        };
    });

    const edges = ontology.relationships.map((rel) => {
        const isConflict = rel.relationType === RelationType.CONFLICTS_WITH;
        return {
            id: rel.id,
            from: rel.sourceId,
            to: rel.targetId,
            label: rel.relationType.replace('_', ' '),
            dashes: rel.auto_detected,
            width: rel.strength ? rel.strength / 20 : 1,
            color: { color: isConflict ? '#ef4444' : '#94a3b8' },
            arrows: 'to',
            font: { align: 'middle', size: 10, color: '#64748b', strokeWidth: 0 },
            smooth: { enabled: true, type: 'continuous' },
        };
    });

    // Add conflict edges
    ontology.conflicts.forEach((conflict) => {
        edges.push({
            id: conflict.id,
            from: conflict.item1.id,
            to: conflict.item2.id,
            label: '⚠️ Conflict',
            dashes: true,
            width: 2,
            color: { color: '#f59e0b' },
            arrows: 'to;from',
            font: { align: 'middle', size: 10, color: '#f59e0b', strokeWidth: 0 },
            smooth: { type: 'curvedCW' },
        } as any);
    });

    return { nodes, edges };
}

export const VIS_OPTIONS: Options = {
    nodes: {
        shape: 'dot',
        size: 16,
    },
    edges: {
        width: 2,
        smooth: {
            enabled: true,
            type: 'continuous',
            roundness: 0.5,
        },
    },
    physics: {
        enabled: true,
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.1,
        },
        stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false,
            fit: true,
        },
    },
    interaction: {
        hover: true,
        tooltipDelay: 200,
        multiselect: true,
        navigationButtons: true,
        keyboard: true,
    },
    layout: {
        randomSeed: 2, // Consistent layout
        improvedLayout: true,
    },
};
