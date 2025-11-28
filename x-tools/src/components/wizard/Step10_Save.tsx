import { useState, useEffect } from 'react';
import { useWizard } from '../../core/store';
import { saveTeam, getSavedTeams, loadTeam, deleteTeam, validateTeamCompleteness } from '../../core/storage';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, Save, Upload, Trash2, RefreshCw, Home, CheckCircle, AlertTriangle } from 'lucide-react';
import type { SavedTeam } from '../../core/types';

interface Step8Props {
    onViewHome?: () => void;
}

export function Step10_Save({ onViewHome }: Step8Props) {
    const { state, dispatch } = useWizard();
    const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Validate completeness
    const validation = validateTeamCompleteness(state);
    const { isComplete, missing } = validation;

    useEffect(() => {
        getSavedTeams().then(setSavedTeams);
    }, []);

    const handleSave = async () => {
        setSaveError(null);
        const result = await saveTeam(state);

        if (result.success) {
            setLastSaved(new Date().toLocaleTimeString());
            const teams = await getSavedTeams();
            setSavedTeams(teams);
            // Navigate to Export/Canvas overview after saving
            dispatch({ type: 'GO_TO_STEP', payload: 10 });
        } else {
            setSaveError(result.error || 'Failed to save team');
        }
    };

    // Temporary hack until we update store
    const handleLoadHack = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Load this team? Unsaved changes to current team will be lost.')) {
            const loadedState = await loadTeam(id);
            if (loadedState) {
                // Load state first, then navigate after React processes the update
                dispatch({ type: 'LOAD_STATE', payload: loadedState });

                // Defer navigation to Export/Canvas overview (step 10)
                setTimeout(() => {
                    dispatch({ type: 'GO_TO_STEP', payload: 10 });
                }, 0);
            }
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Delete this team?')) {
            await deleteTeam(id);
            const teams = await getSavedTeams();
            setSavedTeams(teams);
        }
    };

    const handleDownload = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `team-up-${state.team?.teamName || 'identity'}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        if (event.target.files && event.target.files[0]) {
            fileReader.readAsText(event.target.files[0], "UTF-8");
            fileReader.onload = (e) => {
                try {
                    const importedState = JSON.parse(e.target?.result as string);
                    // Basic validation could go here
                    if (importedState.team) {
                        dispatch({ type: 'SET_TEAM', payload: importedState.team! });
                        // Handle Goals which might be missing in older exports
                        if (importedState.goals) {
                            dispatch({ type: 'SET_GOALS', payload: importedState.goals });
                        } else if (importedState.team?.goals) {
                            dispatch({ type: 'SET_GOALS', payload: importedState.team.goals });
                        }

                        if (importedState.mission) dispatch({ type: 'SET_MISSION', payload: importedState.mission });
                        if (importedState.vision) dispatch({ type: 'SET_VISION', payload: importedState.vision });
                        dispatch({ type: 'SET_VALUES', payload: importedState.values || [] });
                        dispatch({ type: 'SET_BEHAVIORS', payload: importedState.behaviors || [] });
                        dispatch({ type: 'SET_PRINCIPLES', payload: importedState.principles || [] });
                        dispatch({ type: 'SET_ROLES', payload: importedState.roles || [] });
                        dispatch({ type: 'SET_PEOPLE', payload: importedState.people || [] });

                        // Force a re-render or update by setting last saved
                        setLastSaved(new Date().toLocaleTimeString());
                        alert('Import successful!');
                    }
                } catch (err) {
                    console.error(err);
                    alert('Failed to import file.');
                }
            };
        }
    };

    const handleReset = () => {
        // Removed confirm for easier testing/automation
        dispatch({ type: 'RESET' });
    };

    const handlePrev = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Save & Persistence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Completion Status Indicator */}
                <div className={`p-4 rounded-lg border-2 ${isComplete
                    ? 'bg-green-50 border-green-300'
                    : 'bg-amber-50 border-amber-300'
                    }`}>
                    <div className="flex items-start gap-3">
                        {isComplete ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                            {isComplete ? (
                                <>
                                    <div className="font-semibold text-green-900">✓ Team is Complete</div>
                                    <div className="text-sm text-green-700 mt-1">
                                        All required fields are filled. Ready to save!
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="font-semibold text-amber-900">⚠️ Team Incomplete</div>
                                    <div className="text-sm text-amber-700 mt-1">
                                        Missing: <span className="font-medium">{missing.join(', ')}</span>
                                    </div>
                                    <div className="text-xs text-amber-600 mt-2">
                                        Please complete all required steps before saving.
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {saveError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {saveError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Current Team Actions */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-slate-900">Current Team</h3>
                        <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{state.team?.teamName || 'Untitled'}</span>
                                {lastSaved && <span className="text-xs text-green-600">Saved at {lastSaved}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button onClick={handleSave} className="w-full" disabled={!isComplete}>
                                    <Save className="mr-2 h-4 w-4" /> Save to Local Storage
                                </Button>
                                <Button variant="outline" onClick={handleDownload} className="w-full">
                                    <Download className="mr-2 h-4 w-4" /> Export JSON
                                </Button>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImport}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Button variant="outline" className="w-full">
                                        <Upload className="mr-2 h-4 w-4" /> Import JSON
                                    </Button>
                                </div>
                                <Button variant="ghost" onClick={handleReset} className="w-full text-red-600 hover:bg-red-50">
                                    <RefreshCw className="mr-2 h-4 w-4" /> Start Over
                                </Button>
                                {onViewHome && (
                                    <Button variant="secondary" onClick={onViewHome} className="w-full">
                                        <Home className="mr-2 h-4 w-4" /> Back to Home
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Saved Teams List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-slate-900">Saved Teams</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {savedTeams.length === 0 && (
                                <p className="text-sm text-slate-500 italic">No saved teams found.</p>
                            )}
                            {savedTeams.map(team => (
                                <div key={team.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                                    <div>
                                        <p className="font-medium text-sm">{team.name}</p>
                                        <p className="text-xs text-slate-500">{new Date(team.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button type="button" size="sm" variant="outline" onClick={(e) => handleLoadHack(team.id, e)}>Load</Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleDelete(team.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={handlePrev}>Back</Button>
            </CardFooter>
        </Card>
    );
}
