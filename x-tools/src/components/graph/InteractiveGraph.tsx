import { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    BackgroundVariant,
    NodeMouseHandler,
    EdgeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWizard } from '../../core/store';
import { buildOntologyGraph } from '../../core/ontology';
import { convertOntologyToReactFlow } from './GraphUtils';
import { GraphToolbar } from './GraphToolbar';
import { Edit2 } from 'lucide-react';
import { CustomNode } from './CustomNode';

const nodeTypes = {
    custom: CustomNode,
};

interface NodeEditData {
    id: string;
    label: string;
    description?: string;
    tags?: string[];
    entityType: string;
}

export function InteractiveGraph() {
    const { state, dispatch } = useWizard();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedNode, setSelectedNode] = useState<NodeEditData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [rfInstance, setRfInstance] = useState<any>(null);

    // Build ontology and convert to React Flow format
    // Build ontology and convert to React Flow format
    const ontology = useMemo(() => buildOntologyGraph(state), [
        state.team,
        state.vision,
        state.mission,
        state.strategy,
        state.values,
        state.principles,
        state.behaviors,
        state.goals,
        state.roles,
        state.people
    ]);

    useEffect(() => {
        const { nodes: flowNodes, edges: flowEdges } = convertOntologyToReactFlow(ontology);

        // Restore saved positions if available
        if (state.graphLayout?.positions) {
            const restoredNodes = flowNodes.map(node => ({
                ...node,
                position: state.graphLayout.positions[node.id] || node.position
            }));
            setNodes(restoredNodes);
        } else {
            setNodes(flowNodes);
        }

        setEdges(flowEdges);
        setIsInitialized(true);
    }, [ontology, state.graphLayout?.positions, setNodes, setEdges]);

    // Save node positions when they change
    const handleNodeDragStop = useCallback(() => {
        const positions = nodes.reduce((acc, n) => {
            acc[n.id] = n.position;
            return acc;
        }, {} as Record<string, { x: number; y: number }>);

        dispatch({
            type: 'SET_GRAPH_LAYOUT',
            payload: { positions }
        });
    }, [nodes, dispatch]);

    const onConnect = useCallback((params: Connection) => {
        if (isEditMode) {
            setEdges((eds) => addEdge({ ...params, animated: true }, eds));
            // TODO: Implement persistence for custom edges
        }
    }, [setEdges, isEditMode]);

    const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
        if (isEditMode) {
            setSelectedNode({
                id: node.id,
                label: node.data.label || node.data.content || '',
                description: node.data.description,
                tags: node.data.tags,
                entityType: node.data.entityType
            });
            setIsEditModalOpen(true);
        }
    }, [isEditMode]);

    const handleEdgeClick: EdgeMouseHandler = useCallback((_event, edge) => {
        if (isEditMode && window.confirm('Delete this connection?')) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            // TODO: Implement persistence for edge deletion
        }
    }, [isEditMode, setEdges]);

    const handleSaveNode = () => {
        if (!selectedNode) return;

        // Update the node in the graph
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: selectedNode.label.length > 50 ? selectedNode.label.substring(0, 50) + '...' : selectedNode.label,
                            content: selectedNode.label,
                            description: selectedNode.description,
                            tags: selectedNode.tags
                        }
                    };
                }
                return node;
            })
        );

        // TODO: Update the actual state in the store based on entityType
        // This would require dispatching appropriate actions for each entity type

        setIsEditModalOpen(false);
        setSelectedNode(null);
    };

    const handleFitView = () => {
        if (rfInstance) {
            rfInstance.fitView({ padding: 0.2 });
        }
    };

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
                <div className="text-slate-600 dark:text-slate-400">Building graph...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            {/* Edit Mode Toolbar */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-4 py-2 rounded-lg font-semibold shadow-lg transition-all ${isEditMode
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                >
                    {isEditMode ? (
                        <span className="flex items-center gap-2">
                            <Edit2 className="h-4 w-4" />
                            Edit Mode: ON
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Edit2 className="h-4 w-4" />
                            Edit Mode: OFF
                        </span>
                    )}
                </button>
                {isEditMode && (
                    <div className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                        Click nodes to edit • Click edges to delete • Drag to connect
                    </div>
                )}
            </div>

            <GraphToolbar onFitView={handleFitView} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={handleNodeDragStop}
                onNodeClick={handleNodeClick}
                onEdgeClick={handleEdgeClick}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                minZoom={0.1}
                maxZoom={2}
                nodesDraggable={true}
                nodesConnectable={isEditMode}
                elementsSelectable={isEditMode}
            >
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        const bg = node.data?.color || node.style?.background;
                        return typeof bg === 'string' ? bg : '#e2e8f0';
                    }}
                    maskColor="rgba(0, 0, 0, 0.1)"
                />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>

            {/* Node Edit Modal */}
            {isEditModalOpen && selectedNode && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                Edit {selectedNode.entityType}
                            </h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    value={selectedNode.label}
                                    onChange={(e) => setSelectedNode({ ...selectedNode, label: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={selectedNode.description || ''}
                                    onChange={(e) => setSelectedNode({ ...selectedNode, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={selectedNode.tags?.join(', ') || ''}
                                    onChange={(e) => setSelectedNode({
                                        ...selectedNode,
                                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                                    placeholder="tag1, tag2, tag3"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSaveNode}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
