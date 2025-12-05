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
    EdgeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWizard } from '../../core/store';
import { buildOntologyGraph } from '../../core/ontology';
import { convertOntologyToReactFlow } from './GraphUtils';
import { GraphToolbar } from './GraphToolbar';
import { Edit2 } from 'lucide-react';
import { EditableCustomNode } from './EditableCustomNode';

const nodeTypes = {
    custom: EditableCustomNode,
};



export function InteractiveGraph() {
    const { state, dispatch } = useWizard();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
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

        // Restore saved positions if available and inject isEditMode
        if (state.graphLayout?.positions) {
            const restoredNodes = flowNodes.map(node => ({
                ...node,
                position: state.graphLayout.positions[node.id] || node.position,
                data: { ...node.data, isEditMode }
            }));
            setNodes(restoredNodes);
        } else {
            const nodesWithEditMode = flowNodes.map(node => ({
                ...node,
                data: { ...node.data, isEditMode }
            }));
            setNodes(nodesWithEditMode);
        }

        setEdges(flowEdges);
        setIsInitialized(true);
    }, [ontology, state.graphLayout?.positions, isEditMode, setNodes, setEdges]);

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



    const handleEdgeClick: EdgeMouseHandler = useCallback((_event, edge) => {
        if (isEditMode && window.confirm('Delete this connection?')) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            // TODO: Implement persistence for edge deletion
        }
    }, [isEditMode, setEdges]);



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
                        Double-click nodes to edit • Click edges to delete • Drag to connect
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


        </div>
    );
}
