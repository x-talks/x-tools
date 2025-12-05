import React, { useEffect, useState } from 'react';
import { useWizard } from '../core/store';
import { SmartValidator, AICoach, RelationshipIntelligence } from '../core/featureServices';
import { WorkshopPanel } from './WorkshopPanel';

export const SmartDashboard: React.FC = () => {
    const { state, dispatch } = useWizard();
    const [showWorkshop, setShowWorkshop] = useState(false);

    // Auto-run analysis when state changes
    useEffect(() => {
        const insights = AICoach.analyze(state);

        // Also run relationship detection
        const conflicts = RelationshipIntelligence.detectConflicts(state);
        if (conflicts.length > 0) {
            console.log('Conflicts detected:', conflicts);
            // In a real app we would dispatch these to the store
        }

        // Run validation
        // We use the result in the render, but we could also dispatch it
        // const validation = SmartValidator.validateState(state);

        if (JSON.stringify(insights) !== JSON.stringify(state.insights)) {
            dispatch({ type: 'SET_INSIGHTS', payload: insights });
        }

    }, [state.goals, state.values, state.principles, state.behaviors, dispatch, state.insights, state]); // Dependency array

    // Calculate validation on the fly for the dashboard view
    const validation = state.team?.purposeMetadata?.validation || SmartValidator.validateState(state);

    return (
        <>
            {showWorkshop && <WorkshopPanel onClose={() => setShowWorkshop(false)} />}

            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg z-50 transition-all duration-300 transform translate-y-0">
                <div className="flex justify-between items-center max-w-7xl mx-auto">

                    {/* Feature 1: Validation Score */}
                    <div className="flex items-center space-x-4">
                        <div className="text-sm font-semibold text-gray-500">Quality Score</div>
                        <div className={`text-2xl font-bold ${validation.score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                            {validation.score || '--'}
                        </div>
                    </div>

                    {/* Feature 12: AI Coach Insights */}
                    <div className="flex-1 mx-8">
                        {(state.insights || []).length > 0 ? (
                            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                                <span className="text-xl">🤖</span>
                                <span className="text-sm text-blue-800 dark:text-blue-200">
                                    <b>Coach Insight:</b> {state.insights[0].message}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-gray-400">
                                <span className="text-xl">✅</span>
                                <span className="text-sm">Team is aligned. No critical insights.</span>
                            </div>
                        )}
                    </div>

                    {/* Feature 6 & 5 & 11: Control Hub */}
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowWorkshop(!showWorkshop)}
                            className={`px-3 py-1 rounded hover:bg-gray-200 text-xs font-mono transition-colors ${showWorkshop ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 dark:bg-gray-800'}`}
                        >
                            Workshops {state.workshop?.isActive ? '(ON)' : ''}
                        </button>
                        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 text-xs font-mono">
                            Approvals {state.activeReview ? '(1 Pending)' : ''}
                        </button>
                        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 text-xs font-mono">
                            Security
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
