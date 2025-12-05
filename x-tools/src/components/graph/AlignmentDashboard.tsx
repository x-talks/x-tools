import { useEffect, useState } from 'react';
import { useWizard } from '../../core/store';
import { calculateSemanticHealth, SemanticAlignmentMetrics } from '../../core/ontology';
import { Loader2, Activity } from 'lucide-react';

export function AlignmentDashboard() {
    const { state } = useWizard();
    const [metrics, setMetrics] = useState<SemanticAlignmentMetrics | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const analyze = async () => {
            // Need at least purpose to start analysis
            if (!state.team?.teamPurpose) return;

            setLoading(true);
            try {
                const res = await calculateSemanticHealth(state);
                if (mounted) setMetrics(res);
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        // Debounce analysis to avoid heavy ML calls on every keystroke
        const timer = setTimeout(analyze, 2000);
        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [
        state.team?.teamPurpose,
        state.vision?.text,
        state.mission?.text,
        state.strategy?.text,
        // Only trigger on goal text changes, deep comparison might be expensive so we trust the length or content updates
        JSON.stringify(state.goals.map(g => typeof g === 'string' ? g : g.text))
    ]);

    if (!metrics && !loading) return null;

    return (
        <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Semantic Health Check (AI)
            </h3>

            {loading && !metrics ? (
                <div className="flex items-center justify-center p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
            ) : metrics ? (
                <div className="space-y-4">
                    {/* Overall Gauge */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Alignment Score</span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${metrics.overallCoherence > 80 ? 'bg-green-500' :
                                            metrics.overallCoherence > 50 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${metrics.overallCoherence}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{metrics.overallCoherence}%</span>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <MetricRow label="Purpose → Vision" score={metrics.purposeVisionAlignment} />
                        <MetricRow label="Vision → Mission" score={metrics.visionMissionAlignment} />
                        <MetricRow label="Mission → Strategy" score={metrics.missionStrategyAlignment} />
                        <MetricRow label="Strategy → Goals" score={metrics.strategyGoalsAlignment} />
                    </div>

                    <div className="text-[10px] text-slate-400 text-center pt-2">
                        Powered by local embeddings (MiniLM)
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function MetricRow({ label, score }: { label: string, score: number }) {
    if (score === 0) return null; // Hide incomplete sections
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">{label}</span>
            <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${score > 80 ? 'bg-green-500' :
                                score > 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${score}%` }}
                    />
                </div>
                <span className={`w-6 text-right font-medium ${score > 80 ? 'text-green-600 dark:text-green-400' :
                        score > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                    }`}>{score}%</span>
            </div>
        </div>
    )
}
