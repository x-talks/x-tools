import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';
import { getSavedTeams, deleteTeam } from '../core/storage';
import type { SavedTeam } from '../core/types';

interface LandingPageProps {
    onStartNew: () => void;
    onLoadTeam: (team: SavedTeam) => void;
}

export function LandingPage({ onStartNew, onLoadTeam }: LandingPageProps) {
    const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);

    useEffect(() => {
        getSavedTeams().then(setSavedTeams);
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
            await deleteTeam(id);
            const teams = await getSavedTeams();
            setSavedTeams(teams);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pt-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Circle Up</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Align your circle's purpose, values, and behaviors with our psychologically structured identity tool.
                </p>
                <div className="pt-4">
                    <Button size="lg" onClick={onStartNew} className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
                        <Plus className="mr-2 h-6 w-6" /> Create Circle
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                {savedTeams.length > 0 && (
                    <div className="col-span-full pt-4 pb-2">
                        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
                    </div>
                )}

                {savedTeams.map(team => (
                    <Card key={team.id} className="hover:shadow-md transition-shadow cursor-pointer group relative" onClick={() => onLoadTeam(team)}>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    {team.state.team?.logo ? (
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                                            <img src={team.state.team.logo} alt="Logo" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Users className="h-5 w-5 text-blue-600" />
                                        </div>
                                    )}
                                    <span className="truncate font-bold text-lg">{team.name}</span>
                                </div>
                            </CardTitle>
                            <div className="text-sm text-slate-500 pl-[52px]">
                                Last updated: {new Date(team.updatedAt).toLocaleDateString()}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-slate-500 space-y-1">
                                <p>{team.state.people?.length || 0} Members</p>
                                <p>{team.state.values?.length || 0} Values defined</p>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" onClick={(e) => handleDelete(team.id, e)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => onLoadTeam(team)}>
                                <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
