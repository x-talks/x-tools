
import { useState, useEffect, useRef } from 'react';
import { useWizard } from '../../core/store';
import { getSavedTeams, saveTeam, loadTeam, deleteTeam } from '../../core/storage';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, Save, Upload, Trash2, Search as SearchIcon } from 'lucide-react';
import { SavedTeam } from '../../core/types';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAutoSave } from '../../hooks/useAutoSave';

interface Step8Props {
    // onViewHome?: () => void; // Removed as per instruction
}

export function Step10_Save({ }: Step8Props) {
    const { state, dispatch } = useWizard();
    const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);
    const [filteredTeams, setFilteredTeams] = useState<SavedTeam[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { isSaving, lastSaved: autoSaveTime } = useAutoSave(state, true);

    // Validate completeness (validation and its destructuring removed as per instruction)
    // const validation = validateTeamCompleteness(state);
    // const { isComplete, missing } = validation;

    useEffect(() => {
        getSavedTeams().then(teams => {
            setSavedTeams(teams);
            setFilteredTeams(teams);
        });
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredTeams(savedTeams);
            return;
        }
        const query = searchQuery.toLowerCase();
        const filtered = savedTeams.filter(team =>
            team.name.toLowerCase().includes(query) ||
            team.state.team?.teamPurpose?.toLowerCase().includes(query)
        );
        setFilteredTeams(filtered);
    }, [searchQuery, savedTeams]);

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

    const handleLoad = async (team: SavedTeam) => {
        if (confirm('Load this team? Unsaved changes to current team will be lost.')) {
            const loadedState = await loadTeam(team.id);
            if (loadedState) {
                dispatch({ type: 'LOAD_STATE', payload: loadedState });
                // Navigate to Team Canvas (Step 11)
                setTimeout(() => {
                    dispatch({ type: 'GO_TO_STEP', payload: 11 });
                }, 0);
            }
        }
    };

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
        downloadAnchorNode.setAttribute("download", `team - up - ${state.team?.teamName || 'identity'}.json`);
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
                    if (importedState.team) {
                        dispatch({ type: 'SET_TEAM', payload: importedState.team! });
                        if (importedState.goals) dispatch({ type: 'SET_GOALS', payload: importedState.goals });
                        else if (importedState.team?.goals) dispatch({ type: 'SET_GOALS', payload: importedState.team.goals });

                        if (importedState.mission) dispatch({ type: 'SET_MISSION', payload: importedState.mission });
                        if (importedState.vision) dispatch({ type: 'SET_VISION', payload: importedState.vision });
                        if (importedState.strategy) dispatch({ type: 'SET_STRATEGY', payload: importedState.strategy });
                        dispatch({ type: 'SET_VALUES', payload: importedState.values || [] });
                        dispatch({ type: 'SET_BEHAVIORS', payload: importedState.behaviors || [] });
                        dispatch({ type: 'SET_PRINCIPLES', payload: importedState.principles || [] });
                        dispatch({ type: 'SET_ROLES', payload: importedState.roles || [] });
                        dispatch({ type: 'SET_PEOPLE', payload: importedState.people || [] });

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

    const handlePrev = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    useKeyboardShortcuts({
        save: handleSave,
        search: () => searchInputRef.current?.focus(),
        next: () => { },
        prev: handlePrev
    });

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Save & Persistence</CardTitle>
                    {isSaving && <span className="text-sm text-blue-600 animate-pulse">Saving...</span>}
                    {!isSaving && autoSaveTime && (
                        <span className="text-sm text-green-600">Auto-saved at {autoSaveTime.toLocaleTimeString()}</span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-8">

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
                                <Button onClick={handleSave} className="w-full">
                                    <Save className="mr-2 h-4 w-4" /> Save Team
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
                            </div>
                        </div>
                    </div>

                    {/* Saved Teams List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Saved Teams</h3>
                            <span className="text-sm text-slate-500">{filteredTeams.length} team(s)</span>
                        </div>
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search teams... (press '/' to focus)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {filteredTeams.length === 0 && (
                                <p className="text-sm text-slate-500 italic">
                                    {searchQuery ? 'No teams match your search.' : 'No saved teams found.'}
                                </p>
                            )}
                            {filteredTeams.map(team => (
                                <div key={team.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                                    <div>
                                        <p className="font-medium text-sm">{team.name}</p>
                                        <p className="text-xs text-slate-500">{new Date(team.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button type="button" size="sm" variant="outline" onClick={() => handleLoad(team)}>Load</Button>
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
