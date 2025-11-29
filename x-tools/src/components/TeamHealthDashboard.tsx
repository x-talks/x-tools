import { useWizard } from '../core/store';
import { buildOntologyGraph, calculateTeamHealth } from '../core/ontology';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { AlertTriangle, CheckCircle, TrendingUp, GitBranch, Target } from 'lucide-react';

export function TeamHealthDashboard() {
    const { state } = useWizard();
    const graph = buildOntologyGraph(state);
    const health = calculateTeamHealth(state, graph);

    const ScoreCircle = ({ score, label, color }: { score: number; label: string; color: string }) => {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (score / 100) * circumference;

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-200 dark:text-slate-700"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className={color}
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{score}</span>
                    </div>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
            </div>
        );
    };

    const getHealthColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getHealthMessage = (score: number) => {
        if (score >= 80) return 'Excellent alignment!';
        if (score >= 60) return 'Good progress, room for improvement';
        return 'Needs attention';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Team Health Dashboard
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Main Score */}
                <div className="text-center py-4">
                    <ScoreCircle
                        score={health.alignmentScore}
                        label="Alignment Score"
                        color={getHealthColor(health.alignmentScore)}
                    />
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {getHealthMessage(health.alignmentScore)}
                    </p>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completeness</span>
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{health.completenessScore}%</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${health.completenessScore}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Connections</span>
                            <GitBranch className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{health.connectionDensity}%</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                            <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${health.connectionDensity}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Conflict Score</span>
                            <Target className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{health.conflictScore}%</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${health.conflictScore}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Insights */}
                {health.insights.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Recommendations
                        </h4>
                        <ul className="space-y-2">
                            {health.insights.map((insight, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="text-blue-500 mt-0.5">→</span>
                                    {insight}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Graph Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{graph.nodes.length}</div>
                        <div className="text-xs text-slate-500">Total Elements</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{graph.relationships.length}</div>
                        <div className="text-xs text-slate-500">Connections</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{graph.conflicts.length}</div>
                        <div className="text-xs text-slate-500">Conflicts</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
