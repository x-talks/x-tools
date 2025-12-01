import { useEffect, useRef, useState, useCallback } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { v4 as uuidv4 } from 'uuid';
import { useWizard } from '../../core/store';
import { buildOntologyGraph, enhanceWithAIRelationships } from '../../core/ontology';
import { convertOntologyToVis, VIS_OPTIONS, VisNode, VisEdge } from './GraphUtils';
import { GraphToolbar } from './GraphToolbar';

export function InteractiveGraph({ className }: { className?: string }) {
    const { state, dispatch } = useWizard();
    const containerRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<Network | null>(null);
    const nodesRef = useRef<DataSet<VisNode, 'id'> | null>(null);
    const edgesRef = useRef<DataSet<VisEdge, 'id'> | null>(null);
    const [physicsEnabled, setPhysicsEnabled] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isEnhancing, setIsEnhancing] = useState(false);

    // Initialize Graph & AI Enhancement
    useEffect(() => {
        if (!containerRef.current) return;

        const baseOntology = buildOntologyGraph(state);

        // Initial render with base ontology
        updateGraph(baseOntology);

        // Initialize Network if not exists
        if (!networkRef.current) {
            const { nodes: initialNodes, edges: initialEdges } = convertOntologyToVis(baseOntology);
            const nodes = new DataSet<VisNode, 'id'>(initialNodes);
            const edges = new DataSet<VisEdge, 'id'>(initialEdges);
            nodesRef.current = nodes;
            edgesRef.current = edges;

            // Apply saved layout
            if (state.graphLayout) {
                Object.entries(state.graphLayout).forEach(([id, pos]: [string, any]) => {
                    if (nodes.get(id)) {
                        nodes.update({ id, x: pos.x, y: pos.y });
                    }
                });
            }

            const network = new Network(containerRef.current, { nodes: nodes as any, edges: edges as any }, VIS_OPTIONS);
            networkRef.current = network;

            // Event Handlers
            network.on('click', (params) => {
                if (params.nodes.length > 0) {
                    setSelectedNodeId(params.nodes[0]);
                } else {
                    setSelectedNodeId(null);
                }
            });

            network.on('doubleClick', (params) => {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    handleEditNode(nodeId);
                }
            });

            network.on('dragEnd', (params) => {
                if (params.nodes.length > 0) {
                    handleSaveLayout();
                }
            });
        }

        // Trigger AI Enhancement
        async function enhance() {
            if (baseOntology.nodes.length >= 2 && !isEnhancing) {
                setIsEnhancing(true);
                try {
                    const enhanced = await enhanceWithAIRelationships(baseOntology);
                    updateGraph(enhanced);
                } catch (error) {
                    console.error('Failed to enhance graph:', error);
                } finally {
                    setIsEnhancing(false);
                }
            }
        }

        enhance();

        // Cleanup
        return () => {
            // Don't destroy network on every state change, only on unmount
            // But here we are in useEffect with [] dep? No, we need to handle updates.
            if (networkRef.current) {
                networkRef.current.destroy();
                networkRef.current = null;
            }
        };
    }, []); // Run once for init

    // Sync Data when State Changes
    useEffect(() => {
        if (!nodesRef.current || !edgesRef.current || !networkRef.current) return;

        const baseOntology = buildOntologyGraph(state);
        // If we have enhanced ontology, we might want to merge or re-run. 
        // For simplicity, let's just use base for now when state changes, and re-enhance.
        updateGraph(baseOntology);

        // Re-run enhancement
        // ... (Debounce this?)
    }, [state]);

    const updateGraph = (ontology: any) => {
        if (!nodesRef.current || !edgesRef.current) return;
        const { nodes: newNodes, edges: newEdges } = convertOntologyToVis(ontology);

        // Helper to merge updates
        const currentIds = nodesRef.current.getIds();
        const newIds = newNodes.map(n => n.id);

        // Remove deleted
        const toRemove = currentIds.filter(id => !newIds.includes(id as string));
        nodesRef.current.remove(toRemove);

        // Update/Add
        newNodes.forEach(node => {
            const existing = nodesRef.current?.get(node.id);
            if (existing) {
                nodesRef.current?.update({ ...node, x: existing.x, y: existing.y });
            } else {
                nodesRef.current?.add(node);
            }
        });

        // Edges
        const currentEdgeIds = edgesRef.current.getIds();
        const newEdgeIds = newEdges.map(e => e.id);

        const edgesToRemove = currentEdgeIds.filter(id => !newEdgeIds.includes(id as string));
        edgesRef.current.remove(edgesToRemove);

        newEdges.forEach(edge => {
            if (!edgesRef.current?.get(edge.id)) {
                edgesRef.current?.add(edge);
            }
        });
    };

    const handleSaveLayout = useCallback(() => {
        if (!networkRef.current) return;
        const positions = networkRef.current.getPositions();
        dispatch({ type: 'SET_GRAPH_LAYOUT', payload: positions });
    }, [dispatch]);

    const handleEditNode = (nodeId: string) => {
        // Find the entity in state
        // This is a bit complex because we need to know which array it's in.
        // We can infer from the ID prefix or search all arrays.
        // For MVP, we'll just log or show a simple prompt.

        // Better: Use the node group/type to decide.
        const node = nodesRef.current?.get(nodeId);
        if (!node) return;

        const newLabel = window.prompt(`Edit ${node.group}:`, node.label);
        if (newLabel && newLabel !== node.label) {
            updateEntityLabel(nodeId, node.group, newLabel);
        }
    };

    const updateEntityLabel = (id: string, type: string, label: string) => {
        switch (type) {
            case 'value':
                const newValues = state.values.map(v => v.id === id ? { ...v, label } : v);
                dispatch({ type: 'SET_VALUES', payload: newValues });
                break;
            case 'principle':
                const newPrinciples = state.principles.map(p => p.id === id ? { ...p, label } : p);
                dispatch({ type: 'SET_PRINCIPLES', payload: newPrinciples });
                break;
            case 'behavior':
                const newBehaviors = state.behaviors.map(b => b.id === id ? { ...b, label } : b);
                dispatch({ type: 'SET_BEHAVIORS', payload: newBehaviors });
                break;
            case 'goal':
                // Goals are strings in the array, but we gave them IDs like 'goal-0'
                const index = parseInt(id.split('-')[1]);
                if (!isNaN(index) && index >= 0 && index < state.goals.length) {
                    const newGoals = [...state.goals];
                    newGoals[index] = label;
                    dispatch({ type: 'SET_GOALS', payload: newGoals });
                }
                break;
            // Add other types as needed
        }
    };

    const handleAddNode = (type: string) => {
        const label = window.prompt(`Enter ${type} name:`);
        if (!label) return;

        const id = uuidv4();

        switch (type) {
            case 'value':
                dispatch({
                    type: 'SET_VALUES',
                    payload: [...state.values, { id, label, source: 'user', explanation: '' }]
                });
                break;
            case 'principle':
                dispatch({
                    type: 'SET_PRINCIPLES',
                    payload: [...state.principles, { id, label, derivedFrom: [] }]
                });
                break;
            case 'behavior':
                dispatch({
                    type: 'SET_BEHAVIORS',
                    payload: [...state.behaviors, { id, label, derivedFromValues: [], explanation: '', ruleId: 'user' }]
                });
                break;
            case 'goal':
                dispatch({
                    type: 'SET_GOALS',
                    payload: [...state.goals, label]
                });
                break;
        }
    };

    const handleTogglePhysics = () => {
        if (!networkRef.current) return;
        const newStatus = !physicsEnabled;
        setPhysicsEnabled(newStatus);
        networkRef.current.setOptions({ physics: { enabled: newStatus } });
    };

    const handleFit = () => {
        networkRef.current?.fit({ animation: true });
    };

    return (
        <div className={`relative w-full h-[600px] border-2 border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden ${className || ''}`}>
            <GraphToolbar
                onAddNode={handleAddNode}
                onFit={handleFit}
                onTogglePhysics={handleTogglePhysics}
                physicsEnabled={physicsEnabled}
            />
            <div ref={containerRef} className="w-full h-full bg-slate-50 dark:bg-slate-900" />

            {selectedNodeId && (
                <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-3 rounded shadow-lg border border-slate-200 dark:border-slate-700 max-w-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Selected</div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                        {nodesRef.current?.get(selectedNodeId)?.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        Double-click to edit
                    </div>
                </div>
            )}
        </div>
    );
}
