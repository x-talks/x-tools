import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWizard } from '../../core/store';
import { buildOntologyGraph } from '../../core/ontology';
import { convertOntologyToReactFlow } from './GraphUtils';
import { GraphToolbar } from './GraphToolbar';

export function InteractiveGraph() {
    const { state, dispatch } = useWizard();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Build ontology and convert to React Flow format
    useEffect(() => {
        const ontology = buildOntologyGraph(state);
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
    }, [state.team, state.vision, state.mission, state.strategy, state.values, state.principles, state.behaviors, state.goals, setNodes, setEdges]);

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
        setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    }, [setEdges]);

    const handleFitView = () => {
        // React Flow's fitView is handled via the Controls component
        console.log('[Graph] Fit view triggered');
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
            <GraphToolbar onFitView={handleFitView} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={handleNodeDragStop}
                fitView
                attributionPosition="bottom-left"
                minZoom={0.1}
                maxZoom={2}
            >
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        const bg = node.style?.background;
                        return typeof bg === 'string' ? bg : '#e2e8f0';
                    }}
                    maskColor="rgba(0, 0, 0, 0.1)"
                />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
