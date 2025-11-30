import { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    addEdge,
    Connection,
    ConnectionMode,
    ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWizard } from '../core/store';
import { buildOntologyGraph, enhanceWithAIRelationships } from '../core/ontology';
import { RelationType } from '../core/types';
import dagre from 'dagre';

const LAYER_COLORS = {
    identity: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    culture: { bg: '#fce7f3', border: '#ec4899', text: '#9f1239' },
    behavior: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
    execution: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 80 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 200, height: 80 });
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
                y: nodeWithPosition.y - 40,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

export function SemanticRelationshipGraph({ className }: { className?: string }) {
    const { state, dispatch } = useWizard();
    const baseGraph = buildOntologyGraph(state);
    const [enhancedGraph, setEnhancedGraph] = useState(baseGraph);
    const [isEnhancing, setIsEnhancing] = useState(false);

    // Automatically enhance graph with AI when it changes
    useEffect(() => {
        let cancelled = false;

        async function enhance() {
            // Only enhance if we have enough nodes and haven't enhanced this exact state yet
            if (baseGraph.nodes.length >= 2 && !isEnhancing) {
                setIsEnhancing(true);
                try {
                    const enhanced = await enhanceWithAIRelationships(baseGraph);
                    if (!cancelled) {
                        setEnhancedGraph(enhanced);
                    }
                } catch (error) {
                    console.error('Failed to enhance graph:', error);
                } finally {
                    if (!cancelled) {
                        setIsEnhancing(false);
                    }
                }
            } else {
                setEnhancedGraph(baseGraph);
            }
        }

        enhance();

        return () => {
            cancelled = true;
        };
    }, [JSON.stringify(baseGraph.nodes.map(n => n.id))]); // Re-enhance when nodes change

    const graph = enhancedGraph;

    const { initialNodes, initialEdges } = useMemo(() => {
        const nodes: Node[] = graph.nodes.map((node) => {
            const layerStyle = LAYER_COLORS[node.layer];
            return {
                id: node.id,
                type: 'default',
                data: {
                    label: (
                        <div className="text-center p-2">
                            <div className="text-xs font-semibold uppercase text-slate-500 mb-1">
                                {node.type}
                            </div>
                            <div className="font-medium text-sm">
                                {node.label}
                            </div>
                            {node.semanticTags.length > 0 && (
                                <div className="flex flex-wrap gap-1 justify-center mt-1">
                                    {node.semanticTags.slice(0, 2).map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-xs px-1 py-0.5 bg-slate-100 rounded"
                                        >
                                            {tag.concept.toLowerCase()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ),
                },
                position: { x: 0, y: 0 },
                style: {
                    background: layerStyle.bg,
                    border: `2px solid ${layerStyle.border}`,
                    borderRadius: '8px',
                    padding: '4px',
                    width: 200,
                    minHeight: 80,
                },
            };
        });

        const edges: Edge[] = graph.relationships.map((rel) => {
            const isConflict = rel.relationType === RelationType.CONFLICTS_WITH;
            return {
                id: rel.id,
                source: rel.sourceId,
                target: rel.targetId,
                label: rel.relationType.replace('_', ' '),
                type: 'smoothstep',
                animated: rel.auto_detected,
                style: {
                    stroke: isConflict ? '#ef4444' : '#6b7280',
                    strokeWidth: 2,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: isConflict ? '#ef4444' : '#6b7280',
                },
            };
        });

        // Add conflict edges
        graph.conflicts.forEach((conflict) => {
            edges.push({
                id: `conflict-${conflict.id}`,
                source: conflict.item1.id,
                target: conflict.item2.id,
                label: `⚠️ ${conflict.dimension}`,
                type: 'straight',
                animated: true,
                style: {
                    stroke: '#f59e0b',
                    strokeWidth: 3,
                    strokeDasharray: '5,5',
                },
                markerEnd: {
                    type: MarkerType.Arrow,
                    color: '#f59e0b',
                },
            });
        });

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
        return { initialNodes: layoutedNodes, initialEdges: layoutedEdges };
    }, [graph]);

    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params: Connection) => {
        if (!params.source || !params.target) return;

        // Create a new manual edge
        const newEdge: Edge = {
            id: `manual-${params.source}-${params.target}-${Date.now()}`,
            source: params.source,
            target: params.target,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle,
            type: 'straight',
            label: '🔗 Manual',
            animated: false,
            style: {
                stroke: '#8b5cf6',
                strokeWidth: 2,
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#8b5cf6',
            },
        };
        setEdges((eds) => addEdge(newEdge, eds));

        // Find node types from the graph
        const sourceNode = graph.nodes.find(n => n.id === params.source);
        const targetNode = graph.nodes.find(n => n.id === params.target);

        // Save the manual relationship to state
        const existingRelationships = state.relationships || [];
        const newRelationship = {
            id: `manual-rel-${Date.now()}`,
            sourceId: params.source,
            targetId: params.target,
            sourceType: (sourceNode?.type as any) || 'value',
            targetType: (targetNode?.type as any) || 'value',
            relationType: 'user_defined' as RelationType,
            strength: 80,
            confidence: 100,
            explanation: 'Manually connected by user',
            auto_detected: false,
        };

        dispatch({
            type: 'SET_RELATIONSHIPS',
            payload: [...existingRelationships, newRelationship]
        });
    }, [setEdges, graph.nodes, state.relationships, dispatch]);

    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        console.log('Node clicked:', node);
        // Future: Show node details panel
    }, []);



    const handleSaveRelationships = () => {
        const newRelationships = graph.relationships.filter(r => r.auto_detected);
        if (newRelationships.length > 0) {
            // Remove auto_detected flag when saving
            const savedRelationships = newRelationships.map(r => ({ ...r, auto_detected: false }));

            // Merge with existing relationships
            const existingRelationships = state.relationships || [];
            // Filter out duplicates based on IDs or source/target pairs
            const uniqueNew = savedRelationships.filter(newRel =>
                !existingRelationships.some(ex =>
                    (ex.sourceId === newRel.sourceId && ex.targetId === newRel.targetId) ||
                    (ex.sourceId === newRel.targetId && ex.targetId === newRel.sourceId)
                )
            );

            if (uniqueNew.length > 0) {
                dispatch({
                    type: 'SET_RELATIONSHIPS',
                    payload: [...existingRelationships, ...uniqueNew]
                });
            }
        }
    };

    const autoDetectedCount = graph.relationships.filter(r => r.auto_detected).length;

    return (
        <div className={`w-full h-[600px] border-2 border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden relative ${className || ''}`}>
            {autoDetectedCount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-800/90 p-2 rounded shadow-md border border-purple-200 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-medium text-purple-700 dark:text-purple-300">
                            ✨ {autoDetectedCount} AI-detected relationships
                        </div>
                        <button
                            onClick={handleSaveRelationships}
                            className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                        >
                            Save to Graph
                        </button>
                    </div>
                </div>
            )}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                connectionMode={ConnectionMode.Loose}
                connectionLineType={ConnectionLineType.SmoothStep}
                connectionLineStyle={{ stroke: '#8b5cf6', strokeWidth: 2 }}
                fitView
                attributionPosition="bottom-left"
            >
                <Background />
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        const graphNode = graph.nodes.find(n => n.id === node.id);
                        return graphNode ? LAYER_COLORS[graphNode.layer].border : '#ccc';
                    }}
                    nodeBorderRadius={8}
                />
            </ReactFlow>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">Layers</div>
                <div className="space-y-1">
                    {Object.entries(LAYER_COLORS).map(([layer, colors]) => (
                        <div key={layer} className="flex items-center gap-2 text-xs">
                            <div
                                className="w-3 h-3 rounded"
                                style={{ background: colors.bg, border: `2px solid ${colors.border}` }}
                            />
                            <span className="capitalize text-slate-600 dark:text-slate-400">{layer}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="w-8 h-0.5 bg-slate-400" />
                        <span>Relationship</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                        <div className="w-8 h-0.5 bg-yellow-500" style={{ borderTop: '2px dashed' }} />
                        <span>Conflict</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
