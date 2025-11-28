import { useState } from 'react';
import { useWizard } from '../../core/store';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Share2, Eye } from 'lucide-react';
import { transformToVisualization } from '../../core/visualizer';
import { VisualizationModal } from '../ui/VisualizationModal';

export function Step9_Export() {
    const { state, dispatch } = useWizard();
    const [showVisualization, setShowVisualization] = useState(false);

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleExportViz = () => {
        const vizData = transformToVisualization([state]);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vizData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `team-canvas-${state.team?.teamName || 'export'}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handlePrev = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    const vizData = transformToVisualization([state]);

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Team Canvas & Visualization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Visualize Button - Prominent CTA */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">🎨 Interactive Visualization</h3>
                                <p className="text-sm text-slate-600">
                                    View your team identity as an interactive flow diagram. Drag, zoom, and explore your team's structure.
                                </p>
                            </div>
                            <Button
                                onClick={() => setShowVisualization(true)}
                                className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                                size="lg"
                            >
                                <Eye className="mr-2 h-5 w-5" />
                                Visualize
                            </Button>
                        </div>
                    </div>

                    {/* Team Identity Summary */}
                    <details className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <summary className="font-medium text-lg cursor-pointer hover:text-blue-600">
                            Team Identity Summary
                        </summary>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                            <div className="col-span-2">
                                <span className="font-semibold block text-slate-700 mb-1">1. Purpose</span>
                                <div className="p-2 bg-white rounded border border-slate-200">{state.team?.teamPurpose}</div>
                            </div>
                            <div className="col-span-2">
                                <span className="font-semibold block text-slate-700 mb-1">2. Vision</span>
                                <div className="p-2 bg-white rounded border border-slate-200">{state.vision?.text}</div>
                            </div>
                            <div className="col-span-2">
                                <span className="font-semibold block text-slate-700 mb-1">3. Mission</span>
                                <div className="p-2 bg-white rounded border border-slate-200">{state.mission?.text}</div>
                            </div>
                            <div>
                                <span className="font-semibold block text-slate-700 mb-1">4. Values</span>
                                <ul className="list-disc list-inside bg-white p-2 rounded border border-slate-200">
                                    {state.values.map(v => <li key={v.id}>{v.label}</li>)}
                                </ul>
                            </div>
                            <div>
                                <span className="font-semibold block text-slate-700 mb-1">5. Principles</span>
                                <ul className="list-disc list-inside bg-white p-2 rounded border border-slate-200">
                                    {state.principles.map(p => <li key={p.id}>{p.label}</li>)}
                                </ul>
                            </div>
                            <div>
                                <span className="font-semibold block text-slate-700 mb-1">6. Behaviors</span>
                                <ul className="list-disc list-inside bg-white p-2 rounded border border-slate-200">
                                    {state.behaviors.map(b => <li key={b.id}>{b.label}</li>)}
                                </ul>
                            </div>
                            <div>
                                <span className="font-semibold block text-slate-700 mb-1">7. Goals</span>
                                <ul className="list-disc list-inside bg-white p-2 rounded border border-slate-200">
                                    {state.goals?.map((g, i) => <li key={i}>{g}</li>)}
                                </ul>
                            </div>
                            <div className="col-span-2">
                                <span className="font-semibold block text-slate-700 mb-1">Team & Roles</span>
                                <div className="p-2 bg-white rounded border border-slate-200">
                                    <div className="mb-2 font-medium">{state.team?.teamName} - {state.people.length} Members</div>
                                    <ul className="list-disc list-inside text-xs space-y-1">
                                        {state.people.length > 0 ? (
                                            state.people.map(p => (
                                                <li key={p.id}>{p.name} <span className="text-slate-500">({p.role})</span></li>
                                            ))
                                        ) : (
                                            <li className="text-slate-400 italic">No members added</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </details>

                    {/* JSON Export Preview - Collapsible */}
                    <details className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <summary className="mb-2 font-semibold text-slate-900 cursor-pointer hover:text-blue-600">
                            JSON Export Preview
                        </summary>
                        <pre className="max-h-64 overflow-auto rounded bg-slate-900 p-4 text-xs text-slate-50">
                            {JSON.stringify({
                                team: state.team,
                                mission: state.mission,
                                vision: state.vision,
                                values: state.values,
                                behaviors: state.behaviors,
                                principles: state.principles,
                                goals: state.goals,
                            }, null, 2)}
                        </pre>
                    </details>

                    {/* Audit Log - Collapsible */}
                    <details className="rounded-lg border border-slate-200 bg-white p-4">
                        <summary className="mb-2 font-semibold text-slate-900 cursor-pointer hover:text-blue-600">
                            Audit Log
                        </summary>
                        <div className="max-h-48 overflow-auto space-y-2">
                            {state.auditLog.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-100 pb-1 last:border-0">
                                    <span>{entry.details}</span>
                                    <span className="font-mono text-slate-400">{new Date(entry.ts).toLocaleTimeString()}</span>
                                </div>
                            ))}
                        </div>
                    </details>

                </CardContent>
                <CardFooter className="justify-between">
                    <Button variant="outline" onClick={handlePrev}>Back</Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleExportViz}>
                            <Share2 className="mr-2 h-4 w-4" /> Export JSON
                        </Button>
                        <Button onClick={handleNext}>Next: Save</Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Visualization Modal */}
            <VisualizationModal
                isOpen={showVisualization}
                onClose={() => setShowVisualization(false)}
                data={vizData}
                teamName={state.team?.teamName}
            />
        </>
    );
}
