import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
    type Node,
    type Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    MarkerType,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { TeamNode } from './TeamNode';
import { Download, Maximize2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { CombinedVisualization } from '../../core/visualizer';

interface FlowVisualizationProps {
    data: CombinedVisualization;
    onExportPNG?: () => void;
}

const nodeTypes = {
    teamNode: TeamNode,
};

// Layout algorithm using dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 80 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 200, height: 100 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 100,
                y: nodeWithPosition.y - 50,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

export function FlowVisualization({ data, onExportPNG }: FlowVisualizationProps) {
    const [direction, setDirection] = useState<'TB' | 'LR'>('TB');

    // Transform visualization data to React Flow format
    const initialNodes: Node[] = useMemo(() => {
        return data.nodes.map((node) => ({
            id: node.id,
            type: 'teamNode',
            data: {
                label: node.label,
                nodeType: node.type,
                text: node.data?.text,
            },
            position: { x: 0, y: 0 }, // Will be set by layout
        }));
    }, [data.nodes]);

    const initialEdges: Edge[] = useMemo(() => {
        return data.edges.map((edge, idx) => ({
            id: `edge-${idx}`,
            source: edge.from,
            target: edge.to,
            type: ConnectionLineType.SmoothStep,
            animated: true,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#94a3b8',
            },
            label: edge.label,
        }));
    }, [data.edges]);

    const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
        return getLayoutedElements(initialNodes, initialEdges, direction);
    }, [initialNodes, initialEdges, direction]);

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    useEffect(() => {
        const { nodes: newNodes, edges: newEdges } = getLayoutedElements(
            initialNodes,
            initialEdges,
            direction
        );
        setNodes(newNodes);
        setEdges(newEdges);
    }, [direction, initialNodes, initialEdges, setNodes, setEdges]);

    const toggleDirection = useCallback(() => {
        setDirection((d) => (d === 'TB' ? 'LR' : 'TB'));
    }, []);

    return (
        <div className="w-full h-full relative" id="flow-visualization">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                minZoom={0.1}
                maxZoom={2}
                className="bg-slate-50"
            >
                <Background color="#cbd5e1" gap={16} />
                <Controls showInteractive={false} />

                <Panel position="top-right" className="flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={toggleDirection}
                        title="Toggle Layout Direction"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                    {onExportPNG && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onExportPNG}
                            title="Export as PNG"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    )}
                </Panel>

                <Panel position="top-left" className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                    <h3 className="font-semibold text-sm text-slate-900 mb-1">Team Identity Flow</h3>
                    <p className="text-xs text-slate-600">
                        {nodes.length} nodes • {edges.length} connections
                    </p>
                </Panel>
            </ReactFlow>
        </div>
    );
}
